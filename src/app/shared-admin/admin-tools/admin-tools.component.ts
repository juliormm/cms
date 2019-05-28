import { Component, OnInit, Input } from '@angular/core';
import { ProductionSharedService } from '../../production/production-shared.service';
import { ApiService } from '../../core/api.service';
import { DynamicModalService } from '../../core/dynamic-modal.service';
import { ModalYesNoComponent, ModalYesNoData } from '../../shared/modal-yes-no/modal-yes-no.component';
import { Router } from '@angular/router';

import * as moment from 'moment';

@Component({
	selector: 'app-admin-tools',
	templateUrl: './admin-tools.component.html',
	styleUrls: ['./admin-tools.component.scss']
})
export class AdminToolsComponent implements OnInit {

	setTime;
	queueDate;
	queueTime;
	timeInit = false;
	dateInit = false;
	isCollapsed = true;

	priorityList = [1, 2, 3];
	prioritySet;
	modalSub;
	constructor(private _shareData: ProductionSharedService, private api: ApiService, private modalService: DynamicModalService, private router: Router) { }

	ngOnInit() {
		this.setTime = this.queueDate = this.queueTime = new Date(this._shareData.data.start_date);
		this.prioritySet = this._shareData.data.production.priority;
		// this.queueDate = new Date(this._shareData.data.start_date);
		// this.queueTime = new Date(this._shareData.data.start_date);

        this.modalSub = this.modalService.respondModal$.subscribe((data: ModalYesNoData) => {
            this.modalRespose(data)
        })

	}

    modalDelete() {
        const msg = 'Are you sure you want to delete this campaign?';
        this.modalService.showModal({ component: ModalYesNoComponent, title: 'Delete Campaign', message: msg, id: 'deleteCampaign' });
    }

    modalRespose(respData) {
        if (respData.yes) {
            if (respData.id === 'deleteCampaign') {
                this.onDeleteCampaign();
            }

            this.modalService.hideModal();

        } else {
            this.modalService.hideModal();
        }
    }

	onDateChange(event) {


		if (event && event != this.setTime) {
			let eDate = moment(event)
			eDate.hour(this.queueTime.getHours())
			eDate.minutes(this.queueTime.getMinutes())

			this.queueTime = eDate.toDate();
			this.setTime = this.queueTime;
			this.changeStartTime();
		}

	}

	onTimeChange(event) {

		if (this.queueTime != this.setTime) {
			this.setTime = this.queueTime;
			this.changeStartTime();
		}

	}

	// onPrioriyChange(event){

	// }

	changeStartTime() {
		let now = moment(this.setTime);
		const changes = {
			start_date: now.format('YYYY-MM-DD HH:mm:ss')
		}
		this.apiChange(changes);
	}

	onPrioriyChange(event) {
		const changes = {
			production: {
				priority: this.prioritySet
			}
		}

		this.apiChange(changes);
	}

	apiChange(changes) {
		this.api.updateData('sapi/manage/campaign/' + this._shareData.data.campaign_id, changes, false)
			.subscribe(data => {
				console.log(data);
			});
	}

	toTimestamp(strDate) {
		var datum = Date.parse(strDate);
		return datum / 1000;
	}

	onDeleteCampaign(){
		this.api.deleteData('sapi/admin/campaign/' + this._shareData.data.campaign_id, false).subscribe(data => {
			if (data.status === 'success') {
                this.router.navigate(['dashboard/production/list']);
			}
		});
	}

    ngOnDestroy() {
        this.modalSub.unsubscribe();
    }
}
