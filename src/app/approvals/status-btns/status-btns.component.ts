import { Component, OnInit } from '@angular/core';
import { ApprovalSharedService } from '../approval-shared.service';
import { ApprovalStatusService } from '../../core/approval-status.service';
import { IPreviewItem } from '../approval.interface';

@Component({
  selector: 'status-btns',
  templateUrl: './status-btns.component.html',
  styleUrls: ['./status-btns.component.scss']
})
export class StatusBtnsComponent implements OnInit {

  activated = false;
  activeCrv: IPreviewItem;
  disabledChanges: boolean;
  btnChange = 'Request';
  btnApprove = 'Approve';


  constructor(public _shared: ApprovalSharedService, private _sList: ApprovalStatusService) {}

  ngOnInit() {
    this._shared.obsSelected$.subscribe((data: IPreviewItem) => {
      this.activated = false;
      if (data.prv_crv_id) {
        this.activeCrv = data;
        this.btnChange = (this.activeCrv.status === this._sList.CHANGES) ? 'View' : 'Request';
        this.btnApprove = (this.activeCrv.status === this._sList.APPROVED) ? 'Unapprove' : 'Approve';
        if( !data.locked ){
          this.activated = true;
        }
        
      }
      this.disabledChanges = (!this.activated || this.activeCrv.status === this._sList.APPROVED) ? true : false;

    });
  }

  onNotes() {
    this._shared.notesActive = true;
  }

  onApprove() {
    if (!this._shared.notesActive) {
      const request = (this.activeCrv.status === this._sList.APPROVED) ? this._sList.PENDING : this._sList.APPROVED;
      this._shared.udpateCreative(this.activeCrv, { status: request });
    }
  }

}
