





// export interface ICampaignDetail {
//     campaign_id: number;
//     client_name: string;
//     campaign_name: string;
//     tw_id: number;
//     phnx_id: number;
//     previews: IrevsionsGroup[];
// }


export interface productionItem {
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
    manager?:string;
}





// export interface ProductionCampaignData {
//     am: any;
//     am_id?: number;
//     archived: number;
//     campaign_id: number;
//     campaign_name: string;
//     client: any;
//     owner?: string;
//     client_id?: number;
//     creatives?: IcreativeByType[];
//     phnx_id: number;
//     production: any;
//     revisions?: IrevsionsGroup[];
//     server_name: string;
//     tags: string[];
//     tw_id: number;
// }


export interface iTagInsertResponse {
    success?: string[];
    failed?: string[];
}

/* Production List */

export interface productionCampRowItem {
    campaign_id?: number;
    campaign_name?: string;
    server_name?: string;
    tw_id?: number;
    phnx_id?: number;
    am_id?: number;
    archived?: number;
    client_id?: number;
    client?: any;
    rev_status?: any;
    start_date?: string;
    production?: productionItem;
}

export interface IProductionListTableItem {
    hidden: number;
    id: number;
    data: productionCampRowItem;
    notes: string;
    date: string;
    prev_status?: string;
}

// ------------------------------


