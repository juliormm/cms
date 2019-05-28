import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
// import { IamDetail } from './share-admin.interface';

export interface IamDetail {
    am_name: string;
    am_id: number;
    am_email: string;
    am_phnx_id:number;
    am_fullname?:string;
    am_reload?:boolean;
}

export interface IaeDetail {
    ae_name: string;
    ae_id: number;
    ae_email: string;
    ae_phnx_id:number;
    am_reload?:boolean;
}



@Injectable()
export class FormAmListService {

	amList: IamDetail[] = [];
    aeList: IamDetail[] = [];
    initialName:string;

	
    constructor() {}


    buildGroup(data: any = {}) {
        this.initialName = (data.name) ? data.name  : null;
        let idData = (data.id) ? data.id : null;
        let emailData = (data.email) ? data.email : null;
        let phnxData = (data.phnx_id) ? data.phnx_id : null;
        return new FormGroup({
            name: new FormControl( this.initialName, [this.validator()]),
            id: new FormControl(idData),
            email: new FormControl(emailData),
            phnx_id: new FormControl(phnxData)
        });
    }


    validator() {
        /* beautify preserve:start */
        return (control: AbstractControl): {[key: string]: any} => {

            if (!control.value || this.amList.length == 0) { // allow empty
                return null
            }

            const name = control.value;
            const valid = this.amList.find((val: any, idx: number, obj: any[]) => {
                return val.name == name;
            })
            return (valid) ? null : { 'amGroup': { name } };
        };
        /* beautify preserve:end */
    }

}
