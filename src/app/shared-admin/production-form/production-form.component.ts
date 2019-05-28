import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { productionItem } from '../../_interfaces/manage.interface'
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { INgxMyDpOptions } from 'ngx-mydatepicker';
import { AuthenticationService } from '../../core/authentication.service';


import { ProductionListService } from '../production-list.service';

@Component({
    selector: 'production-form',
    templateUrl: './production-form.component.html',
    styleUrls: ['./production-form.component.scss']
})
export class ProductionFormComponent implements OnInit, AfterViewChecked {


    @Input() team: number;
	@Input() productionForm: FormGroup;
    @Input() disabledForm: boolean;

    client_dueCtrl: FormControl;
    internal_dueCtrl: FormControl;
    designerCtrl: FormControl;
    project_statusCtrl: FormControl;
    internal_statusCtrl: FormControl;
    phnx_taskCtrl: FormControl;
    hiddenCtrl: FormControl;
    managerCtrl: FormControl;
    notesCtrl: FormControl;

    @Output('clientDueDate') client_dueChange = new EventEmitter();
    @Output('internalDueDate') internal_dueChange = new EventEmitter();
    @Output('designer') designerChange = new EventEmitter();
    @Output('manager') managerChange = new EventEmitter();
    @Output('projectStatus') project_statusChange = new EventEmitter();
    @Output('internalStatus') internal_statusChange = new EventEmitter();
    @Output('phnxTask') phnx_taskChange = new EventEmitter();
    @Output('hidden') hiddenChange = new EventEmitter();
    @Output('notes') notesChange = new EventEmitter();


    myDatePickerOptions: INgxMyDpOptions = {
        dateFormat: 'mmm dd yyyy',
        disableWeekends: true
    };

    userInfo;

    static setDate(dtString: string) {
        if (dtString) {
            const arr: string[] = dtString.split('-');
            const dataObj = {
                date: {
                    year: parseInt(arr[0], 10),
                    month: parseInt(arr[1], 10),
                    day: parseInt(arr[2], 10),
                }
            }
            return dataObj;
        } else {
            return null;
        }
    }

    static buildGroup(data?: productionItem, _disabled=false) {
        let setData: productionItem = {
            prod_tracking_id: null,
            campaign_id: null,
            client_due: null,
            internal_due: null,
            manager: null,
            designer: null,
            hidden: null,
            phnx_task: null,
            project_status: null,
            internal_status: null
        }
        if (data) {
            setData = Object.assign({}, data);
        }



        return new FormGroup({
            client_due: new FormControl({ value: this.setDate(setData.client_due), disabled: true }),
            internal_due: new FormControl({ value: this.setDate(setData.internal_due), disabled: true }),
            designer: new FormControl({ value: setData.designer, disabled: _disabled }),
            manager: new FormControl({ value: setData.manager, disabled: _disabled }),
            project_status: new FormControl({ value: setData.project_status, disabled: _disabled }),
            internal_status: new FormControl({ value: setData.internal_status, disabled: _disabled }),
            phnx_task: new FormControl({ value: setData.phnx_task, disabled: _disabled }),
            hidden: new FormControl({ value: setData.hidden, disabled: _disabled }),
            notes: new FormControl({ value: setData.notes, disabled: _disabled })

        });
    }

    constructor(private fb: FormBuilder, public _lists: ProductionListService, private cdRef: ChangeDetectorRef, private auth: AuthenticationService) { }

    ngOnInit() {
        this.userInfo = this.auth.getUser();
        this.client_dueCtrl = this.productionForm.get('client_due') as FormControl;
        this.internal_dueCtrl = this.productionForm.get('internal_due') as FormControl;
        this.designerCtrl = this.productionForm.get('designer') as FormControl;
        this.managerCtrl = this.productionForm.get('manager') as FormControl;
        this.project_statusCtrl = this.productionForm.get('project_status') as FormControl;
        this.internal_statusCtrl = this.productionForm.get('internal_status') as FormControl;
        this.phnx_taskCtrl = this.productionForm.get('phnx_task') as FormControl;
        this.hiddenCtrl = this.productionForm.get('hidden') as FormControl;
        this.notesCtrl = this.productionForm.get('notes') as FormControl;
        this.applyValidation();

        this.client_dueCtrl.valueChanges.subscribe(data => this.client_dueChange.emit({ name: 'client_due', value: this.returnDate(data.date), valid: true }));
        this.internal_dueCtrl.valueChanges.subscribe(data => this.internal_dueChange.emit({ name: 'internal_due', value: this.returnDate(data.date), valid: true }));
        this.designerCtrl.valueChanges.subscribe(data => this.designerChange.emit({ name: 'designer', value: data, valid: true }));
        this.managerCtrl.valueChanges.subscribe(data => this.managerChange.emit({ name: 'manager', value: data, valid: true }));

        this.project_statusCtrl.valueChanges.subscribe(data => this.project_statusChange.emit({ name: 'project_status', value: data, valid: true }));
        this.internal_statusCtrl.valueChanges.subscribe(data => this.internal_statusChange.emit({ name: 'internal_status', value: data, valid: true }));
        this.phnx_taskCtrl.valueChanges.subscribe(data => this.phnx_taskChange.emit({ name: 'phnx_task', value: data, valid: this.phnx_taskCtrl.valid }));
        this.hiddenCtrl.valueChanges.subscribe(data => this.hiddenChange.emit({ name: 'hidden', value: data, valid: true }));
        // this.notesCtrl.valueChanges.debounceTime(1000).subscribe(data => this.notesChange.emit({ name: 'notes', value: data, valid: true }));
        // 
    }

    onNotesBlur(event){
        this.notesChange.emit({ name: 'notes', value: this.notesCtrl.value, valid: true })
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    applyValidation() {
        this.phnx_taskCtrl.setValidators([this.validateTaskLink()]);
        this.phnx_taskCtrl.updateValueAndValidity();
    }

    returnDate(date) {
        // console.log(date);
        return date.year + '-' + date.month + '-' + date.day;
    }

    validateTaskLink() {
        /* beautify preserve:start */
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                return null
            }
            const name = control.value;
            return (control.value.match('https://phnx.fm/|https://platform.lin-digital.com/')) ? null : { 'phnx_task': { name } };
        };
        /* beautify preserve:end */
    }

}
