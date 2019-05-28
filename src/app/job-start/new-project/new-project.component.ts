import { Component, OnInit, OnDestroy, ViewChild, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { FormAmListComponent, IPersonDetail } from '../../shared-admin/form-am-list/form-am-list.component';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
// import { FormAmListService } from '../../shared-admin/form-am-list.service';
import { FormClientComponent } from '../../shared-admin/form-client/form-client.component';
import { CreativeArrayComponent } from '../../shared-admin/creative-array/creative-array.component';
import { AlertService, IAlerts } from '../../core/alert.service';

import { IphnxUnits } from '../projects.interface'
import { IcreativeDetail, IcampaignData } from '../../shared-admin/share-admin.interface';


import { DynamicModalService } from '../../core/dynamic-modal.service';
import { ModalYesNoComponent, ModalYesNoData } from '../../shared/modal-yes-no/modal-yes-no.component';

import { SharedModule } from '../../shared/shared.module';

export interface IProjectSave {
    am: any;
    ae: any;
    campaign_name: string;
    client: any;
    creatives: any[];
    owner: string;
}


@Component({
    selector: 'app-new-project',
    templateUrl: './new-project.component.html',
    styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit, OnDestroy {

    phnxID: number;
    manualDisabled = false;
    disableImports = false;
    loadedPreProj = false;
    // dataNotSaved = false;
    savedJobs: IcampaignData[];
    importedData: IcampaignData;
    projectForm: FormGroup;
    ownerControl: FormControl;
    amGroupControl: FormGroup;
    aeGroupControl: FormGroup;
    clientGroupControl: FormGroup;
    creativesControl: FormArray;
    campaignNameControl: FormControl;
    subToday = this.getTodayFormat();
    serverFolderName = '';
    // resetBtnTxt = 'Reset';
    saveLaterBtn = 'Save for Later';
    modalSub;

    amList: IPersonDetail[] = [];
    aeList: IPersonDetail[] = [];

    templates = {
        'edge': { name: "Edge Animate", team:"Internal" },
        'hype': { name: "HYPE", team:"Theorem" }
    };

    templateSelected = 'edge';

    @ViewChild('arrayList') public arrayList: CreativeArrayComponent;
    @ViewChild('fPHNX') public phnxField: any;
    @ViewChild('selectPreviews') public selectPreviews;
    @ViewChild('amSelectView') public amSelectView;
    @ViewChild('aeSelectView') public aeSelectView;
    @ViewChild('clientField') public clientField;


    constructor(private api: ApiService,
        // private amService: FormAmListService, 
        private _alert: AlertService, private router: Router, private _modalService: DynamicModalService) { }

    ngOnInit() {
        this.buildForm();
        // this.loadPreviewsSaved();
        this.initListeners();

        this.modalSub = this._modalService.respondModal$.subscribe((data: ModalYesNoData) => {
            this.modalRespose(data)
        })

    }

    ngOnDestroy() {
        this.modalSub.unsubscribe();
    }

    onSubmitForm() {

        let store: IProjectSave;
        store = Object.assign({}, this.projectForm.value);
        if (store.owner !== 'ThirdParty') {
            store.owner = 'LIN';
        } else {
            store.creatives = [];
        }
        store['template'] = this.templateSelected;
        store['server_name'] = this.serverFolderName;
        store['team'] = this.templates[this.templateSelected].team;
        store['phnx_id'] = (this.phnxID) ? +this.phnxID : null;
        store['remove'] = (this.importedData) ? this.importedData.id : 0;
        // store.ae =   (this.importedData) ? this.importedData.ae : null;

        console.log(store);
        this.api.insertData('sapi/jobstart/init', store, true)
            .subscribe((json) => {
                if (json.status === 'success') {
                    this.router.navigate(['/dashboard/production/campaign/' + json['data']]);
                } else {
                    this._alert.error({ msg: json.message, style: { 'width': '100%', 'position': 'fixed', 'top.px': 0 } });
                    console.log('--> error', json);
                }
            });
    }

    initListeners() {
        this.campaignNameControl.valueChanges
            .subscribe(data => {
                this.makeServerName();
            });

        this.clientGroupControl.get('client_name').valueChanges
            .subscribe(data => {
                this.makeServerName();
            });
    }

    loadPreviewsSaved() {
        this.api.getData('sapi/jobstart/savelater').subscribe((data: IcampaignData[]) => {
            if (!('failed' in data)) {
                this.savedJobs = data;
            } else {
                this.savedJobs = [];
            }
        })
    }

    setAMList(data) {
        this.amList = data;
    }

    setAEList(data) {
        this.aeList = data;
    }

    makeServerName() {
        const client = (this.clientGroupControl.get('client_name').value) ? this.sanatizeNames(this.clientGroupControl.get('client_name').value) : '';
        const campaign = (this.campaignNameControl.value) ? this.sanatizeNames(this.campaignNameControl.value) : '';

        if (this.templateSelected == 'hype') {
            this.serverFolderName = this.phnxID + '_' + campaign + '_' + this.subToday;
        } else {
            this.serverFolderName = (client || campaign) ? client + '-' + campaign + '_' + this.subToday : '';
        }

    }

    sanatizeNames(value: string) {
        return this.toTitleCase(value).replace(/([\W_])+/g, '');
    }


    toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    getTodayFormat() {
        const today = new Date();
        return today.getFullYear().toString().substring(2) + '-' + today.toISOString().substr(4, 6).replace(/[^0-9]+/g, '')
    }

    onPreSaved(index) {
        if (this.importedData || this.creativesControl.length > 0) {
            this.onResetForm();
        }

        this.importedData = this.savedJobs[index];
        this.applyToForm(this.importedData);
        this.loadedPreProj = true;
        // this.resetBtnTxt = 'Cancel';

    }

    applyToForm(data: IcampaignData) {
        if (data.am && data.am !== null) {

            let sendData: IPersonDetail = { name: data.am.am_name, id: data.am.am_id, email: data.am.am_email, phnx_id: data.am.am_phnx_id }

            if (data.am.am_reload) {
                this.amSelectView.reloadList(sendData);
            } else {
                const found = this.findAMbyPhnxID(data.am.am_phnx_id);
                console.log(found);
                if (found) { this.setAMValues(found) };
                // this.setAMValues(sendData)
            }
        }

        if (data.ae && data.ae !== null) {

            let sendData: IPersonDetail = { name: data.ae.ae_name, id: data.ae.ae_id, email: data.ae.ae_email, phnx_id: data.ae.ae_phnx_id }

            // if (data.am.am_reload) {
            // this.amSelectView.reloadList(sendData);
            // } else {
            // const found = this.findAMbyPhnxID(data.am.am_phnx_id);
            // console.log(found);
            // if (found) { this.setAMValues(found) };
            this.setAEValues(sendData)
            // }
        }

        if (data.client) { this.setClientValues(data.client) };
        if (data.campaign_name) { this.campaignNameControl.setValue(data.campaign_name); }
        if (data.creatives.length > 0) { this.populateSavedCreatives(data.creatives); }
        if (data.owner) { this.ownerControl.setValue(data.owner); }
        if (data['phnx_id'] && data.client) { this.clientField.importedData = true; }
        this.phnxID = data['phnx_id'];
        this.disableImports = true;

        console.log(this.projectForm.value);
    }

    populateSavedCreatives(data: any[]) {
        this.arrayList.blockMultiple = data.length;
        this.arrayList.blockCount = 0;
        data.forEach((item, idx) => {
            const crvOpts = {
                video: false,
                map: false,
                gallery: false,
                form: false,
                custom: false,
                location: false,
                expandable: false,
                fmcontent: false,
                carousel: false,
                pushdown: false
            }

            console.log(typeof item.options);
            console.log(item.options);
            if (item.options && typeof item.options === 'string') {
                const optArr: string[] = item.options.split(',');
                optArr.forEach(opt => {
                    crvOpts[opt] = true;
                });
            } else {
                if (item.options) {
                    const keys = Object.keys(item.options);
                    keys.forEach(opt => {
                        if (item.options[opt]) {
                            crvOpts[opt] = true;
                        }

                    });
                }

            }

            const store = Object.assign({}, item);
            store['options'] = crvOpts;
            setTimeout(() => {
                this.arrayList.addItem(store, false);
            }, 100);
        });
    }


    findAMbyPhnxID(phnxID) {
        const found = this.amList.find(item => {
            return item.phnx_id === phnxID;
        });
        return found;
    }

    findAMbyID(amID) {
        const found = this.amList.find(item => {
            return item.id === amID;
        });
        return found;
    }


    onImportPHNX() {
        this._alert.removeAll();
        this.api.getData('sapi/jobstart/phnx/' + this.phnxID).subscribe((data: IcampaignData) => {
            if (Object.keys(data).length > 0) {
                this.manualDisabled = true;
                this.importedData = data;

                this.applyToForm(data);
            } else {
                const a: IAlerts = { msg: 'We could not find PHNX id ' + this.phnxID };
                this._alert.error(a);
            }


        })
    }
    setClientValues(data) {
        this.clientGroupControl.setValue(data);
    }

    setAMValues(data) {
        this.amGroupControl.setValue(data);
    }

    setAEValues(data) {
        console.log(this.aeGroupControl.value)
        this.aeGroupControl.setValue(data);
        console.log(this.aeGroupControl.value)
    }


    buildForm() {
        this.projectForm = new FormGroup({
            client: FormClientComponent.buildGroup(null),
            campaign_name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
            am: FormAmListComponent.buildGroup(),
            ae: FormAmListComponent.buildGroup(),
            owner: new FormControl('LIN'),
            creatives: new FormArray([])
        });


        this.campaignNameControl = this.projectForm.get('campaign_name') as FormControl;
        this.ownerControl = this.projectForm.get('owner') as FormControl;
        this.amGroupControl = this.projectForm.get('am') as FormGroup;
        this.aeGroupControl = this.projectForm.get('ae') as FormGroup;
        this.clientGroupControl = this.projectForm.get('client') as FormGroup;
        this.creativesControl = this.projectForm.get('creatives') as FormArray;


    }

    onResetForm() {
        this.arrayList.removeAll();

        this.projectForm.reset();
        console.log('values after reset', this.projectForm.value);
        this.ownerControl.setValue('LIN')
        this.phnxID = null;
        this.phnxField.reset();
        this.disableImports = false;
        this.manualDisabled = false;
        this.loadedPreProj = false;
        this.serverFolderName = '';
        // this.dataNotSaved = false;
        // this.selectPreviews.nativeElement.value = null; // resetting saved select

        if (this.importedData) {
            this.importedData = null;
        }

    }

    modalReset() {
        const msg = 'Are you sure you want to reset?'
        this._modalService.showModal({ component: ModalYesNoComponent, title: 'Reset Form?', message: msg, id: 'resetForm' });
    }

    modalDelete() {
        const msg = 'Are you sure you want to delete this save for later data?';
        this._modalService.showModal({ component: ModalYesNoComponent, title: 'Delete Temp Campaign?', message: msg, id: 'deleteLater' });
    }

    modalSubmit() {
        const msg = 'Are you sure you want to initiate this project?';
        this._modalService.showModal({ component: ModalYesNoComponent, title: 'Start Project?', message: msg, id: 'submitNow' });
    }

    modalRespose(respData) {
        console.info('modal response', respData)
        if (respData.yes) {
            // const respData = this._modalService.getData();
            if (respData.id === 'resetForm') {
                this.onResetForm();
            }

            if (respData.id === 'deleteLater') {
                this.onDeleteCurrentSave();
            }

            if (respData.id === 'submitNow') {
                this.onSubmitForm();
            }

            this._modalService.hideModal();

        } else {
            console.warn("Modal Canceled")
            this._modalService.hideModal(); // cancelled
        }
    }



    onDeleteCurrentSave() {
        if (this.importedData) {
            this.api.deleteData('sapi/jobstart/savelater/' + this.importedData.id)
                .subscribe(data => {
                    this.loadPreviewsSaved();
                    this.onResetForm();
                })
        }
    }

    onSaveFormLater() {
        let store: IProjectSave;
        store = Object.assign({}, this.projectForm.value);
        // console.log(this.projectForm.value)
        let extra = '';
        if (this.importedData) {
            store['phnx_id'] = (this.phnxID) ? +this.phnxID : null;
            extra = '/' + this.importedData.id;
        } else {
            store['phnx_id'] = null;
        }


        // clean empty creative
        if (!store.creatives[store.creatives.length - 1].type) {
            store.creatives.splice(-1, 1);
        }

        console.log(store);

        this.api.insertData('sapi/jobstart/savelater' + extra, store)
            .subscribe((data) => {
                if (typeof data === 'number') {
                    this.loadPreviewsSaved();
                    this.onResetForm();
                }
            });
    }

    saveValidate(a, b) {
        return ((!a && !b) || (!a || !b)) ? true : false;
    }

    submitValidate() {
        if (!this.projectForm.valid) { return true; }
        if (this.creativesControl.length === 0 && this.ownerControl.value === 'LIN') { return true; }

        return false;
    }

    templateChanged() {
        this.makeServerName();
    }
}
