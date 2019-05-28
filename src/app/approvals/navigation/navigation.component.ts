import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IPreviewItem, IPreviewObjects } from '../approval.interface';
import { ApprovalSharedService } from '../approval-shared.service'

@Component({
  selector: 'preview-nav',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  @Input() crvTypeList: IPreviewObjects[];
  @Input() active: number;
  @Input() menuOpen: boolean;
  @Output() changeCreativeRequest = new EventEmitter();
  cDict = {
    'approved': 'sb-sizes-approved',
    'pending': 'sb-sizes-pending',
    'changes': 'sb-sizes-changes'
  }

  constructor(public _shared: ApprovalSharedService) {}


  changeCreative(id: number) {
    this.changeCreativeRequest.emit(id);
  }

  setNavClasses(crv: IPreviewItem, isLast: boolean) {
    let c;
    c = {};
    c[this.cDict[crv.status]] = true;
    c['sizes-selected'] = (this.active === crv.prv_crv_id) ? true : false;
    c['sb-sizes-last'] = isLast;
    return c
  }

}
