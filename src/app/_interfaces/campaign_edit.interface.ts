export interface IcreativeTypeDetail {
    crv_id: number;
    extension: string;
    local_path: string;
    name: string;
    portfolio: number;
    size: string;
    size_name: string;
    features: string[];
    no_preview: boolean;
    tag: string;
    type: string;
}

export interface IcreativeByType {
    type?: string;
    tag?: string;
    items: IcreativeTypeDetail[];
}

export interface IcreativeDetail {
    id?: number;
    crv_id?: number;
    prv_crv_id?: number;
    size?: string;
    status?: string;
    type?: string;
    tag?: string;
    name?: string;
    extension?: string;
    client_notes?: string;
    url_path?: string;
    url_params?: string;
    local_path?: string;
    features?: string[];
    campaign_id?: number;
}


export interface IrevCrvsGroup {
    type?: string;
    tag?: string;
    items: IcreativeDetail[];
    versions?: boolean;
}


export interface IrevsionsGroup {
    preview_rev_id: number;
    revision: number;
    server: string;
    rev_date: string;
    rev_hash: string;
    submitted: number;
    global_status: string;
    creatives?: IrevCrvsGroup[];
}


export interface ICampaignDownloadData {
    am: any;
    // am_id?: number;
    archived: number;
    request_archive: number;
    request_unarchive: number;
    campaign_id: number;
    campaign_name: string;
    client: any;
    owner?: string;
    // client_id?: number;
    creatives?: IcreativeByType[];
    phnx_id: number;
    production: any;
    revisions?: IrevsionsGroup[];
    server_name: string;
    tags: string[];
    tw_id: number;
    showcase?: number;
    showcase_rev?: number;
}
