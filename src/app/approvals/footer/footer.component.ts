import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApprovalSharedService } from '../approval-shared.service';
import { ApprovalStatusService } from '../../core/approval-status.service';
import { IPreviewItem } from '../approval.interface'

@Component({
  selector: 'preview-foot-nav',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Output() arrowRequest = new EventEmitter();
  dataItem: IPreviewItem;
  disableLeft = true;
  disableRight = true;
  currentIndex: number = -1;

  constructor(public _shared: ApprovalSharedService, private _statusList: ApprovalStatusService) {}

  ngOnInit() {
    this._shared.obsSelected$.subscribe((data: IPreviewItem) => {

      if (data.prv_crv_id) {
        this.dataItem = data;
        this.currentIndex = this._shared.idList.indexOf(this.dataItem.prv_crv_id);
      } else {
        this.dataItem = {};
        this.currentIndex = -1;
      }
      this.validateArrows();
    });

    this.validateArrows();
  }

  validateArrows() {
    this.disableRight = (this.currentIndex === 0 || this.currentIndex === -1) ? true : false;
    this.disableLeft = (this.currentIndex === this._shared.idList.length - 1 || this.currentIndex === -1) ? true : false;
  }

  onNext() {
    this.arrowRequest.emit(this._shared.idList[this.currentIndex + 1]);
  }

  onPrev() {
    this.arrowRequest.emit(this._shared.idList[this.currentIndex - 1]);
  }

}
