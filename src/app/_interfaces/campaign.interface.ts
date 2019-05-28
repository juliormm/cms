export interface scriptPublish {
    publish_time: string;
    publish_req: number;
    publish_error: number;
}

export interface scriptPreview {
    preview_time: string;
    preview_req: number;
    preview_error: number;
}

export interface IScripts {

    id: number;
    // time: string;
    publish: scriptPublish;
    previews: scriptPreview;
}

export interface amData {
    email?: string;
    first_name?: string;
    id?: number;
    last_name?: string;
    phnx_am_id?: number;
}


export interface clientData {
    client_id?: number;
    client_name?: string;
    phnx_customer_id?: number;
}

export interface creativeData {
    campaign_id?: number;
    crv_id?: number;
    extension?: string;
    features?: string[];
    local_path?: string;
    name?: string;
    portfolio?: number;
    size?: string;
    size_name?: string;
    type?: string;
    tag?: string;
    prv_crv_id?: number;
}

export interface creativeDataGroup {
    items: creativeData[];
    tag?: string;
    type?: string;
}

export interface revisionCreativeData {
    client_notes?: string;
    crv_id?: number;
    custom_name?: string;
    dynamic_name?: string;
    extension?: string;
    name?: string;
    portfolio?: number;
    prv_crv_id?: number;
    size?: string;
    size_name?: string;
    status?: string;
}


export interface revisionGroupCreativeData {
    items?: revisionCreativeData[];
    tag?: string;
    type?: string;
    versions?: boolean;
}


export interface revisionData {
    campaigns_id?: number;
    created_at?: string;
    prv_crv_id?: number;
    creatives?: revisionGroupCreativeData[];
    date?: string;
    global_status: string;
    hash?: string;
    preview_rev_id?: number;
    revision?: number;
    server?: string;
    submitted?: number;
    updated_at?: string;
}

export interface productionData {
    prod_tracking_id?: number;
    campaign_id?: number;
    client_due?: string;
    internal_due?: string;
    notes?: string;
    designer?: string;
    hidden?: number
    phnx_task?: string;
    project_status?: string;
    internal_status?: string;
    manager?: string;
    priority?: number;
}

export interface campaignData {
    am?: amData;
    ae_name?: string;
    archived?: number;
    campaign_id?: number;
    campaign_name?: string;
    client?: clientData;
    contractor?: number;
    creatives?: creativeDataGroup[];
    owner?: string;
    phnx_id?: number;
    production?: productionData;
    revisions?: revisionData[];
    rev_status?: revisionData;
    published?: any[];
    server_name?: string;
    start_date?: string;
    tags?: string[];
    tw_id?: number;
    scripts?: IScripts;
    setup?: number;
    templates?: string;
}
