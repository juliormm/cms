export interface IPreviewItem {
    client_notes?: string
    crv_id?: number;
    extension?: string;
    custom_name?: string;
    display_name?: string;
    name?: string;
    portfolio?: number;
    prv_crv_id?: number;
    size?: string;
    size_name?: string;
    status?: string;
    type?: string;
    tag?: string;
    versions?: boolean;
    url_path?: string;
    url_params?: string;
    server?: string;
    locked?: number;
}

export interface IPreviewObjects {
    tag?: string;
    items?: IPreviewItem[];
    versions: boolean;
}

export interface IPreviewData {

    am_id?: number;
    campaign_id?: number;
    campaign_name?: string;
    client_name?: string;
    preview_id?: number;
    rev?: number;
    rev_date?: string;
    rev_hash?: string;
    server?: string;
    submitted?: number;
    previews?: IPreviewObjects[];
}


export interface ICurrentCreative {
    type?: number;
    crv?: number;
}


export interface IDataHolder {
    [id: number]: IPreviewItem;
}
