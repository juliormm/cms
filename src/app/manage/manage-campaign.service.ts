import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ApprovalStatusService } from '../core/approval-status.service';
import { ICampaignData, IPreviewData, IPreviewCreatives, ICreativeItem, IShowCase } from '../shared-admin/campaign-data.service';

// export interface ICreativeItem {
// 	campaign_id: number;
// 	crv_id: number;
// 	extension: string;
// 	features: string[];
// 	local_path: string;
// 	name: string;
// 	no_preview: boolean;
// 	portfolio: number;
// 	size: string;
// 	size_name: string;
// 	tag: string;
// 	type: string;
// }

// export interface IShowCase {
// 	active: number;
// 	cover: string;
// 	description: string;
// 	revision: number;
// 	// showcase_id: number;
// }


// export interface IPreviewItem {
// 	client_notes: string;
// 	crv_id: number;
// 	custom_name: string;
// 	extension: string;
// 	name: string;
// 	portfolio: number;
// 	prv_crv_id: number;
// 	size: string;
// 	size_name: string;
// 	status: string;
// 	tag: string;
// 	type: string;
// 	url_params: string;
// 	url_path: string;
// }
// export interface IPreviewCreatives {
// 	type?: string;
// 	tag?: string;
// 	items?: IPreviewItem[];
// 	versions?: boolean;
// }

// export interface IPreviewData {
// 	preview_rev_id?: number;
// 	revision?: number;
// 	server?: string;
// 	rev_date?: string;
// 	rev_hash?: string;
// 	submitted?: number;
// 	global_status?: string;
// 	creatives?: IPreviewCreatives[];
// }

// export interface ICampaignData {
// 	am: any;
// 	archived: number;
// 	request_archive: number;
// 	request_unarchive: number;
// 	campaign_id: number;
// 	campaign_name: string;
// 	client: any;
// 	owner?: string;
// 	creatives?: ICreativeItem[];
// 	phnx_id: number;
// 	production: any;
// 	revisions?: IPreviewData[];
// 	server_name: string;
// 	tags: string[];
// 	tw_id: number;
// 	show_case?: IShowCase;
// }

@Injectable()
export class ManageCampaignService {

	private dataChange = new Subject();
	$dataChanged = this.dataChange.asObservable();

	private previewsChange = new Subject();
	$previewsChanged = this.previewsChange.asObservable();

	private crvsChange = new Subject();
	$creativesChanged = this.crvsChange.asObservable();

	private showcaseChange = new Subject();
	$showcaseChanged = this.showcaseChange.asObservable();

	fullData: ICampaignData;

	constructor(private _approvalServ: ApprovalStatusService) { }


	setCampaignData(data: ICampaignData) {
		this.fullData = data;
	}

	getGlobalRevisionStatus(revs: IPreviewData) {
		const list = [];
		for (let c = revs.creatives.length - 1; c >= 0; c--) {
			const cI = revs.creatives[c];
			for (let i = cI.items.length - 1; i >= 0; i--) {
				const crv = cI.items[i];
				list.push(crv.status);
			}
		}

		if (list.indexOf(this._approvalServ.PENDING) !== -1) {
			return this._approvalServ.PENDING;
		} else if (list.indexOf(this._approvalServ.CHANGES) !== -1) {
			return this._approvalServ.CHANGES;
		} else {
			return this._approvalServ.APPROVED;
		}

	}

	getRevisionIndex(data: IPreviewData): number {
		return this.fullData.revisions.findIndex(elm => { return elm.revision === data.revision; });
	}

	updateRevisions(data: IPreviewData[]) {
		this.fullData.revisions = data;
		this.dataChange.next(this.fullData);
	}

	updateSingleRevision(data: IPreviewData) {
		// console.log(this.fullData.revisions )
		const newRevisions = this.fullData.revisions.map(elm => {
			if (elm.revision === data.revision) {
				elm = data;
			}
			return elm;
		});

		this.fullData.revisions = newRevisions;
		this.dataChange.next(this.fullData);
	}

	updateProduction(data) {
		const newProd = data;
		this.fullData.production = newProd;
		this.dataChange.next(this.fullData);
	}

	updateCreatives(data: ICreativeItem[]) {
		this.fullData.creatives = data;
		this.dataChange.next(this.fullData);
	}

	updateSingleCreative(data: ICreativeItem) {
		const newCrvs = this.fullData.creatives.map(elm => {
			if (elm.crv_id === data.crv_id) {
				elm = data;
			}
		});
		this.dataChange.next(this.fullData);
	}

	updateShowcase(data: any) {
		this.fullData.show_case = {...this.fullData.show_case, ...data};
		this.showcaseChange.next(this.fullData.show_case);
	}


}
