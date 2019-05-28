import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, TemplateRef } from '@angular/core';
import { revisionCreativeData, revisionGroupCreativeData, creativeData, revisionData } from '../../_interfaces/campaign.interface';
import { ApprovalStatusService } from '../../core/approval-status.service';
import { ApiService } from '../../core/api.service';
import { AuthenticationService } from '../../core/authentication.service';
import { environment } from '../../../environments/environment';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'revision-status-detail',
    templateUrl: './revision-status-detail.component.html',
    styleUrls: ['./revision-status-detail.component.scss']
})
export class RevisionStatusDetailComponent implements OnInit, OnChanges {

    @Input() revisionData: revisionData;

    @Input() changeStatus = false;
    // @Input() lockRevision = false;
    @Input() showLockPreview = false;
    @Input() urlParams = false;
    @Input() internalPreview = false;
    @Input() duplicateCreative = false;
    @Input() startCollapsed = true;
    @Input() showLockCrv = false;
    @Input() showIncludeCrv = false;
    @Input() customName = false;
    @Output() showCreative: EventEmitter<revisionGroupCreativeData> = new EventEmitter<revisionGroupCreativeData>();
    @Output() creativeStatusUpdate: EventEmitter<any> = new EventEmitter<any>();
    creativeList: creativeData[];
    tempParam: string;
    prevCreative;

    modalRef: BsModalRef;
    modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false,
        class: 'modal-lg'
    }

    logedUser: any;

    serverURL: string;

    constructor(public _shared: ApprovalStatusService, private api: ApiService, private modalService: BsModalService, private _auth: AuthenticationService) {
        this.logedUser = this._auth.getUser();
    }

    ngOnInit() { }

    setPanelColor() {
        if (this.revisionData.global_status === 'changes') { return 'panel-danger' }
        if (this.revisionData.global_status === 'approved') { return 'panel-success' }
        if (this.revisionData.global_status === 'initiated') { return 'panel-info' }
        return 'panel-default';
    }

    ngOnChanges(changes: SimpleChanges) {
        // console.log(changes)
        if (changes['revisionData']) {
            this.closePreview();
            this.getRevisionCreativeList();
        }
    }

    getServerPath(){
        if(this.revisionData.server === 'PREVIEWS'){
            return environment.ASSETS_PREVIEW_URL;
        } else if(this.revisionData.server === 'QT'){
            return environment.ASSETS_QT_URL;
        } else {
            return environment.ASSETS_HYFN_URL;
        }

        // return (this.revisionData.server === 'PREVIEWS') ? environment.ASSETS_PREVIEW_URL : environment.ASSETS_QT_URL;
    }

    getRevisionCreativeList() {
        this.creativeList = [];
        this.revisionData.creatives.forEach(t => {
            t.items.forEach(c => {
                this.creativeList.push(c);
            });
        });
    }

    onAddCreative(item: creativeData) {
        this.api.insertData('sapi/manage/revisions/creative/' + item.prv_crv_id + '/duplicate', {})
            .subscribe(data => {
                console.log(data);
            });
    }

    // onChangeCrvLock(event, crv, key){
    //     // console.log(event, crv)
    //     const data = { locked: (event) ? 1 : 0 }
    //     this.api.updateData('sapi/previews/creative/' + crv, data)
    //        .subscribe(resp => {
    //            // console.log(resp)
    //         // this.creativeStatusUpdate.emit(this.revisionData);
    //     })

    // }

    onChangeCrvData(name, value, id){
        let data = {};

        if (name == 'custom_name' || name == 'url_params' || name == 'status'){
            data[name] = value;
        } else {
            data[name] = (value) ? 1 : 0;
        }

        this.api.updateData('sapi/manage/revisions/creative/' + id, data)
                .subscribe(res => {
                    // console.log(res);
                     this.creativeStatusUpdate.emit(this.revisionData);
                });
        
    }

    // INPUT field changes


    onLockRevisionChange(status) {
        if (this.showLockPreview) {
            const val = (status) ? 1 : 0;
            const data = { submitted: val };
            this.api.updateData('api/previews/rev/' + this.revisionData.preview_rev_id, data)
                .subscribe(response => {
                    console.log(response);
                },
                err => {
                    console.log(err);
                });
        }
    }




    // onBlur(crv: creativeData, key: string) {
    //     if (this.tempParam !== crv[key]) {'custom_name'
    //         const val = (crv[key]) ? crv[key] : null;
    //         const data = { [key]: val };

    //         console.log(data)
    //         // this.api.updateData('sapi/manage/revisions/creative/' + crv.prv_crv_id, data)
    //         //     .subscribe(res => {
    //         //         console.log(res);
    //         //     });
    //     }

    // }

    onFocus(crv: creativeData, key) {
        this.tempParam = crv[key];
    }

    // onChangeStatus(_crv, _rev, _value) {
    //     const data = { status: _value }
    //     this.api.updateData('api/previews/creative/' + _crv.prv_crv_id, data).subscribe(resp => {
    //         this.creativeStatusUpdate.emit(this.revisionData);
    //     })
    // }

    // preview stuff
    closePreview() {
        // if (!this.internalPreview) {
        //     this.showCreative.emit({});
        // } else {
        // this.modalRef = this.modalService.hide(template);
        this.prevCreative = null;
        // }
    }

    nameDisplay(crv: revisionCreativeData) {
        if (crv.custom_name) {
            return 'custom';
        }

        if (!crv.name) {
            return '( ' + crv.dynamic_name + ' )';
        }

        return crv.name;
    }

    showPreview(crv: revisionGroupCreativeData, template?: TemplateRef<any>) {
        if (!this.internalPreview) {
            this.showCreative.emit(crv);
        } else {
            this.prevCreative = crv;
            this.modalRef = this.modalService.show(template, this.modalConfig);
        }
    }
}
