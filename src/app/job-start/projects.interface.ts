export interface IphnxCustomer {
    id: number;
    name: string;
    email: string;
}

export interface IphnxVertical {
    name: string;
    short_name: string;
    id: number;
    created_at: string;
    modified_at: string;
    force_change_log: boolean;
}

export interface IphnxMediaPlan {
    start_date: string;
    end_date: string
}

export interface IphnxAttachments {
    name: string;
    url: string;
}

export interface IphnxSalesReps {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

export interface IphnxUnits {
    name: string;
    unit_id: number;
    product_execution: string;
    option: string;
    internal_creative: number;
}
export interface IphnxAccountManager {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

export interface IphnxProject {
    id: number;
    name: string;
    customer: IphnxCustomer;
    vertical: IphnxVertical;
    kpi: string;
    media_plan: IphnxMediaPlan;
    target_audience: any[];
    attachments: IphnxAttachments[];
    sales_reps: IphnxSalesReps[];
    units: IphnxUnits[];
    account_manager: IphnxAccountManager;
    type: number;
    creative_status: string;
}

export interface ISaveLater {
    am_id: number;
    campaign_name: string;
    client_id: number;
    client_name: string;
    creatives: any[];
    id: number;
    owner: string;
}
