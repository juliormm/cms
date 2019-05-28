import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { Subscription } from 'rxjs';
import { ApprovalStatusService } from '../../core/approval-status.service';
import { AmSharedService } from '../am-shared.service';

@Component({
    selector: 'campaign-revision',
    templateUrl: './campaign-revision.component.html',
    styleUrls: ['./campaign-revision.component.scss']
})
export class CampaignRevisionComponent implements OnInit {

    campDetail: any;
    showCreative:any;
    activeRevision:any;

    constructor(private route: ActivatedRoute, public _shared: AmSharedService, private _setClass: ApprovalStatusService) {}

    ngOnInit() {
        this._shared.obsRevision$
            .subscribe((data: any) => {
                this.campDetail = data;
                this.activeRevision = data.revisions;
            });

       this.route.params
            .subscribe((param: any) => {
                this._shared.setRevision(+param['cID']);
            })
    }


    showPreview(crv) {
        this.showCreative = crv;
    }

    setClassStatus(statList: string) {
        return this._setClass.getColorClass(statList);
    }

}
