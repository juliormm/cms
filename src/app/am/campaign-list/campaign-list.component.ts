import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApprovalStatusService } from '../../core/approval-status.service';
import { AmSharedService } from '../am-shared.service';

@Component({
    selector: 'campaign-list',
    templateUrl: './campaign-list.component.html',
    styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {
    user: number;
    inited:boolean = false;
    message:string = 'Loadig campaigns...';
    
    constructor(private route: ActivatedRoute, private router:Router,  private _setClass: ApprovalStatusService, public _shared: AmSharedService) {}

    ngOnInit() {
        this.route.data
            .subscribe((data) => {
                if('failed' in data['campaigList']){
                    this.message = 'Sorry, we could not find any projects.';
                } else {
                   this._shared.setNewData(data['campaigList']);
                    this.inited = true;
                }
            });
    }

    setClassStatus(statList: string) {
        return this._setClass.getColorClass(statList);
    }

}
