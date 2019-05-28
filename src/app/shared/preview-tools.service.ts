import { Injectable } from '@angular/core';


export interface IPreviewCreatives {
    type?: string;
    tag?: string;
    items?: any[];
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



@Injectable()
export class PreviewToolsService {

  constructor() { }


  updateRevisionData(from: IPreviewData, changes: IPreviewData) {
  	
  }

}
