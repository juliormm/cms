import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DynamicModalService, ModalPassData } from '../../core/dynamic-modal.service';
import { ModalModule } from 'ngx-bootstrap';
import { ModalDirective } from 'ngx-bootstrap/modal';


export interface ModalYesNoData {
  yes: boolean;
  id: string;
  pass?: any;
}

@Component({
  selector: 'app-modal-yes-no',
  templateUrl: './modal-yes-no.component.html',
  styleUrls: ['./modal-yes-no.component.scss']
})
export class ModalYesNoComponent implements OnInit, OnDestroy {

  // @ViewChild('modal') daModal;
  // passData: any;
  response: ModalYesNoData = { yes: false, id: '' };
  dataInfo: ModalPassData;
  constructor(public _modalService: DynamicModalService) { }

  ngOnInit() {
    this.dataInfo = this._modalService.getData();
    console.log(this.dataInfo)
    this.response.id = this.dataInfo.id;
    this.response.pass = this.dataInfo.pass;
  }

  ngOnDestroy() {
    console.log('modal removed');
  }

  onYes() {
    this.response.yes = true;
    this._modalService.sendResponse(this.response);
  }

  onNo() {
    this._modalService.sendResponse(this.response);
  }



}
