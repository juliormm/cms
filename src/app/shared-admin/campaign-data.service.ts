import { Injectable } from '@angular/core';



export interface ICreativeItem {
    campaign_id: number;
    crv_id: number;
    extension: string;
    features: string[];
    local_path: string;
    name: string;
    no_preview: boolean;
    portfolio: number;
    size: string;
    size_name: string;
    tag: string;
    type: string;
}

export interface IShowCase {
    active: number;
    cover: string;
    description: string;
    revision: number;
    // showcase_id: number;
}


export interface IPreviewItem {
    client_notes: string;
    crv_id: number;
    custom_name: string;
    extension: string;
    name: string;
    portfolio: number;
    prv_crv_id: number;
    size: string;
    size_name: string;
    status: string;
    tag: string;
    type: string;
    url_params: string;
    url_path: string;
}
export interface IPreviewCreatives {
    type?: string;
    tag?: string;
    items?: IPreviewItem[];
    versions?: boolean;
}

export interface IPreviewData {
    preview_rev_id?: number;
    revision?: number;
    server?: string;
    rev_date?: string;
    rev_hash?: string;
    submitted?: number;
    global_status?: string;
    creatives?: IPreviewCreatives[];
}

export interface ICampaignData {
    am: any;
    archived: number;
    request_archive: number;
    request_unarchive: number;
    campaign_id: number;
    campaign_name: string;
    client: any;
    owner?: string;
    creatives?: ICreativeItem[];
    phnx_id: number;
    production: any;
    revisions?: IPreviewData[];
    server_name: string;
    tags: string[];
    tw_id: number;
    show_case?: IShowCase;
}



@Injectable()
export class CampaignDataService {

    private campaign: ICampaignData;

    constructor() { }

    setData(data) {
        this.campaign = data;
    }

    getLastRevision() {
        // this.campaign.
    }


}
