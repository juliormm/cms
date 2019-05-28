import {  IPersonDetail } from './form-am-list/form-am-list.component';



export interface IclientDetail{
    client_name:string;
    client_id:number;
    client_phnx_id:number;
}

export interface IcreativeOptions {
    video: boolean;
    map: boolean;
    gallery: boolean;
    form: boolean;
    custom: boolean;
    location:boolean;
    expandable:boolean;
    fmcontent:boolean;
    carousel:boolean;
    pushdown:boolean;
    clicktocall:boolean;
}

export interface IsizeGroup {
    std_size?:string;
    custom_size:string;
    expand_size:string;
}

export interface IcreativeDetail {
    type: string;
    size: IsizeGroup;
    versionName: string;
    options: IcreativeOptions;
}

export interface IaeDetail {

    ae_name: string;
    ae_email: string;
    ae_id: number;
    ae_phnx_id: number;
}

export interface IamDetail {
    am_name: string;
    am_id: number;
    am_email: string;
    am_phnx_id:number;
    am_fullname?:string;
    am_reload?:boolean;
}

export interface IcampaignData{
    client:IclientDetail;
    campaign_name:string;
    am:IamDetail;
    ae:IaeDetail;
    creatives:IcreativeDetail[];
    owner:string;
    phnx_id:number;
    id:number;
}

