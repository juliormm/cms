import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface ModalPassData {
  [key: string]: any;
  id: string;
  pass?: any;
}

@Injectable()
export class DynamicModalService {

    private startModal = new Subject<any>();
    startModal$ = this.startModal.asObservable();

    private respondModal = new Subject<any>();
    respondModal$ = this.respondModal.asObservable();

    private closeModal = new Subject<any>();
    closeModal$ = this.closeModal.asObservable();

    private mData: ModalPassData;

    constructor() {}

    getData() {
        return this.mData;
    }

    clearData() {
        this.mData = null;
    }

    showModal(_data: ModalPassData) {
        this.mData = _data;
        this.startModal.next(_data);
    }

    hideModal() {
        this.closeModal.next({});
        this.mData = null;
    }

    sendResponse(_data: any) {
        this.respondModal.next(_data);
    }

}
