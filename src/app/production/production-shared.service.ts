import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { ApprovalStatusService } from '../core/approval-status.service';
import { campaignData, creativeData, revisionGroupCreativeData, creativeDataGroup } from '../_interfaces/campaign.interface';

@Injectable()
export class ProductionSharedService {

    private subjectFullData = new BehaviorSubject({});
    private subjectRevision = new Subject();
    private subjectScripts = new Subject();
    data: campaignData;
    revData: any = {};
    previewIndex: number;
    currRev: number = null;
    showPreviewErr = false;

    obsFullData$ = this.subjectFullData.asObservable();
    obsRevision$ = this.subjectRevision.asObservable();
    obsScripts$ = this.subjectScripts.asObservable();

    constructor(private _status: ApprovalStatusService) { }

    setNewData(_data: campaignData) {
        this.data = _data;
        this.subjectFullData.next(this.data);
    }

    /*
        REVISIONS
    */

    setRevision(rev: number) {
        this.currRev = rev;
        this.revData = this.data.revisions.find((element, index: number) => {
            this.previewIndex = index;
            return element.revision === +rev;
        })
        this.subjectRevision.next(this.revData);
    }

    getNewGlobalStatus(pI: number) {
        for (const obj of this.data.revisions[pI].creatives) {
            for (const crv of obj.items) {
                if (crv.status === this._status.PENDING) {
                    return this._status.PENDING;
                } else if (crv.status === this._status.CHANGES) {
                    return this._status.CHANGES;
                }
            }
        }

        return this._status.APPROVED;
    }

    updateGlovalStatus(crvID) {
        const revInx = this.findRevision(this.currRev);
        this.getNewGlobalStatus(revInx);
        this.data.revisions[revInx].global_status = this.getNewGlobalStatus(revInx);
        this.subjectFullData.next(this.data);
        this.setRevision(this.currRev);
        // let crvData = this.findCreative(revInx, crvID);
        this.subjectScripts.next({});

    }

    findRevision(rev: number) {
        const prev = this.data.revisions.findIndex((element: any, index: number) => {
            return element.revision === +rev;
        })

        return prev;
    }



    /*
       CREATIVES
    */

    updateCreatives(upData: creativeDataGroup[]) {
        const temp = JSON.parse(JSON.stringify(upData));
        this.data.creatives = temp;
    }

    updateCreative(crv: creativeData) {
        for (let i = this.data.creatives.length - 1; i >= 0; i--) {
            if (this.data.creatives[i].tag === crv.tag) {
                const idx = this.data.creatives[i].items.findIndex(item => {
                    return item.crv_id === crv.crv_id;
                });
                this.data.creatives[i].items[idx].features = crv.features;
            }
        }
    }

    disablePublish() {
        const len = this.data.revisions.length;
        if (len > 0 && this.data.revisions[len - 1].submitted == 1 && this.data.revisions[len - 1].global_status == 'approved' && this.data.scripts.publish.publish_req == 0) {

            return false;

        }
        return true;
    }

    disablePreview() {
       if(this.data.setup == 1){
           const len = this.data.revisions.length;
            if (this.data.scripts.previews.preview_req == 0 && (len == 0 || (len > 0 && this.data.revisions[len - 1].submitted == 1)) && this.data.scripts.publish.publish_req == 0) {
                return false;
            }
       }
       
        return true;
    }

    getPreviewMessage() {
        if (this.data.scripts.previews.preview_req == 1) {
            return 'The preview is being generated, you will see the preview bellow when done.';
        } else if (this.data.scripts.previews.preview_error = 1) {
            return 'There was an error in making the preview. Please try again.';
        } else {
            return '';
        }
    }

    updateScriptData(data){
        this.data.scripts = data;
        this.subjectScripts.next(data);
        // this.subjectScripts.next(data)
    }




    findCreative(revIdx: number, crvID: number) {
        // // for (let crv of this.data.revisions[revIdx].creatives) {
        // for (let i = this.data.revisions[revIdx].creatives.length - 1; i >= 0; i--) {
        //     let crvFound = this.data.revisions[revIdx].creatives[i].items.find(crv => {
        //         return crv.prv_crv_id == crvID;
        //     });
        //     if (crvFound) {
        //         return crvFound;
        //     }
        // }
    }

}
