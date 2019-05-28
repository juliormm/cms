import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AmSharedService {

    private subjectFullData = new BehaviorSubject({});
    private subjectRevision = new BehaviorSubject({});
    fullData: any;
    revData: any = {};
    previewIndex: number;
    currRev: number;

    obsFullData$ = this.subjectFullData.asObservable();
    obsRevision$ = this.subjectRevision.asObservable();

    setNewData(_data: any) {
        this.fullData = _data;
        this.subjectFullData.next(this.fullData);
    }

    setRevision(campaignID: number) {
        this.currRev = campaignID;
        const temp = this.findCampaign(campaignID);
        if (temp) {
            this.revData = temp;
            this.subjectRevision.next(this.revData);
        }


    }

    findCampaign(id) {
        for (const item of this.fullData.campaigns) {
            if (item.campaign_id === id) {
                return item;
            }
        }
        return null;
    }

}
