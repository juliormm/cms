import { Component, OnInit, Output, Input, EventEmitter  } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

import { ApiService } from '../../core/api.service';
// import { FormAmListService } from '../form-am-list.service';
// import { IamDetail, IaeDetail } from '../form-am-list.service';
import { IphnxAccountManager } from '../../job-start/projects.interface';

export interface IPersonDetail {
    name?: string;
    id?: number;
    email?: string;
    phnx_id?: number;
    reload?:boolean;
}

// export interface IamDetail {
//     am_name: string;
//     am_id: number;
//     am_email: string;
//     am_phnx_id:number;
//     am_fullname?:string;
//     am_reload?:boolean;
// }

// export interface IaeDetail {
//     ae_name: string;
//     ae_id: number;
//     ae_email: string;
//     ae_phnx_id:number;
//     am_reload?:boolean;
// }


@Component({
    selector: 'form-am-list',
    templateUrl: './form-am-list.component.html',
    styleUrls: ['./form-am-list.component.scss']
})
export class FormAmListComponent implements OnInit {

    @Input() listType: string;
    @Input() fGroup: FormGroup;
    @Output() nameSelected = new EventEmitter();
    @Output() fullList = new EventEmitter();

    activeList: IPersonDetail[];

    controlName: FormControl;

    title:String;
    // intialName = '';

    listToUse:string;

    static buildGroup(data: IPersonDetail = {}) {
        let name = (data.name) ? data.name  : null;
        let idData = (data.id) ? data.id : null;
        let emailData = (data.email) ? data.email : null;
        let phnxData = (data.phnx_id) ? data.phnx_id : null;
        return new FormGroup({
            name: new FormControl( name, []),
            id: new FormControl(idData),
            email: new FormControl(emailData),
            phnx_id: new FormControl(phnxData)
        });
    }

    constructor(private api: ApiService, 
        // public amService: FormAmListService
        ) {}

    ngOnInit() {
        this.listToUse = (!this.listType) ? 'am' : this.listType;
        this.title = (this.listToUse == 'am') ? 'Account Manager' : 'Account Executive';
  
        this.api.getData('sapi/lists/' + this.listToUse).subscribe(result => {
                this.activeList = result;
                this.fullList.emit(result);
        });
        // this.reloadList();
        this.controlName = this.fGroup.get('name') as FormControl;
        this.controlName.valueChanges.subscribe(data => this.onValueChange(data))
    }    

    reloadList(data?){
        this.api.getData('sapi/lists/' + this.listType).subscribe(result => {
            // this.amService.amList = result;
            this.activeList = result;
            this.fullList.emit(result);
            if(data){
                this.applyValues(data); 
            }
        });
    }

    applyValues(data:IPersonDetail){
        this.fGroup.setValue({
            name: data.name,
            id: data.id,
            email: data.email, 
            phnx_id:data.phnx_id
        });
    }

    // amApllyValues(data:IamDetail){
    //     this.fGroup.setValue({
    //         am_name: data.am_name,
    //         am_id: data.am_id,
    //         am_email: data.am_email, 
    //         am_phnx_id:data.am_phnx_id
    //     });
    // }

    onValueChange(data) {
        if (data == '') {
            this.fGroup.setValue({
                name: null,
                id: null,
                email: null, 
                phnx_id:null
            });
        }
    }

    nameSelectedHandle(e: TypeaheadMatch) {
        this.nameSelected.emit(e.item);
        this.fGroup.setValue(e.item);
        this.controlName.markAsDirty();       
    }

}
