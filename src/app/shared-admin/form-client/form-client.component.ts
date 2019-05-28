import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { IclientDetail } from '../../shared-admin/share-admin.interface';

import { ApiService } from '../../core/api.service';

@Component({
    selector: 'form-client',
    templateUrl: './form-client.component.html',
    styleUrls: ['./form-client.component.scss']
})
export class FormClientComponent implements OnInit {

    @Input() clientGroup: FormGroup;

    initDataCopy: any;
    clientChange = false;
    clientRename = false;
    clientRenameSelected = false;
    clientAddingNew = false;

    clientNameControl: FormControl;
    clientIDControl: FormControl;
    clientPHNXidControl: FormControl;
    clientLoading: boolean;
    clientDataSource: Observable<any>;
    selectedName: string;
    importedData = false;
    // formInitedBlank = true;

    static buildGroup(data: IclientDetail) {
        const initData = (data) ? data : { client_name: null, client_id: null, client_phnx_id: null };

        return new FormGroup({
            client_name: new FormControl(initData.client_name, [Validators.required, Validators.minLength(2)]),
            client_id: new FormControl(initData.client_id),
            client_phnx_id: new FormControl(initData.client_phnx_id)
        });
    }

    constructor(private api: ApiService) { }


    ngOnInit() {
        this.initControls();
        this.clientDataSource = Observable
            .create((observer: any) => {
                if (this.clientNameControl.value) {
                    this.api.getData('sapi/search/clients/' + this.clientNameControl.value.split(' ').join('/'), false)
                        .subscribe((result: any) => {
                            if ('failed' in result) {
                                observer.next([]);
                            } else {
                                observer.next(result);
                            }
                        });
                } else {
                    console.log('some error happend')
                }
            });
    }


    initControls() {
        this.clientNameControl = this.clientGroup.get('client_name') as FormControl;
        this.clientNameControl.valueChanges.subscribe(data => {
            this.onClientNameChange(data)
        });

        this.clientIDControl = this.clientGroup.get('client_id') as FormControl;
        this.clientPHNXidControl = this.clientGroup.get('client_phnx_id') as FormControl;
        // this.formInitedBlank = (this.clientNameControl.value) ? false : true;
        this.initDataCopy = { client_name: this.clientNameControl.value, client_id: this.clientIDControl.value, client_phnx_id: this.clientPHNXidControl.value };

    }

    reset(data?) {
        this.clientChange = false;
        this.clientRename = false;
    }

    clientSelectedHandle(e: TypeaheadMatch) {
        this.selectedName = e.item.client_name;
        this.clientIDControl.setValue(e.item.client_id);
        this.clientIDControl.markAsDirty();
        this.handleErrorMsg(e.item.client_name);

    }

    handleErrorMsg(value: string) {
        if (this.initDataCopy.client_name && value) { // started with data
            if (this.selectedName && this.initDataCopy.client_name !== value) { // change client name
                 console.log('change to other...')
                this.clientChange = true;
                this.clientRename = false;
                this.clientPHNXidControl.setValue(this.initDataCopy.client_phnx_id);
                this.clientIDControl.setValue(this.initDataCopy.client_id);
            } else if (this.initDataCopy.client_name !== value) { // rename client
                console.log('renaming...')
                this.clientChange = false;
                this.clientRename = true;
            } else {
                 console.log('whattt>>>...')
                this.clientChange = false;
                this.clientRename = false;
                this.clientPHNXidControl.setValue(this.initDataCopy.client_phnx_id);
                this.clientIDControl.setValue(this.initDataCopy.client_id);
                this.clientGroup.markAsPristine();
            }
        } else if (!this.initDataCopy.client_name && value) { // started blank
            if (this.selectedName && this.selectedName !== value) { // renaming selected
                this.clientRenameSelected = true;
                this.clientAddingNew = false;
            } else if (this.selectedName && this.selectedName === value) { // assigning client
                this.clientRenameSelected = false;
                this.clientAddingNew = false;
            } else { // adding new client
                if (this.importedData) {
                    this.clientRenameSelected = true;
                    this.clientAddingNew = false;
                } else {
                    this.clientRenameSelected = false;
                    this.clientAddingNew = true;
                }

            }
        }
    }

    onClientNameChange(value) {
        // if (!value) {
        //     this.clientPHNXidControl.setValue(null);
        //     this.clientIDControl.setValue(null);
        //     this.clientRenameSelected = false;
        //     this.selectedName = null;
        //     this.clientChange = false;
        //     this.clientRename = false;
        // }

        this.handleErrorMsg(value);
    }

}
