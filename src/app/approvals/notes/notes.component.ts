import { Component } from '@angular/core';
import { ApprovalSharedService } from '../approval-shared.service';
import { ApprovalStatusService } from '../../core/approval-status.service';
import { IPreviewItem } from '../approval.interface';

@Component({
  selector: 'preview-creative-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent {
  crvInfo: IPreviewItem;
  initNotes: string;
  clientNotes: string;


  constructor(public _shared: ApprovalSharedService, public _sList: ApprovalStatusService) {
    _shared.obsSelected$
      .subscribe((data: IPreviewItem) => {
        this.crvInfo = data;
        this.clientNotes = this.initNotes = this.crvInfo['client_notes'];
      });
  }

  displayToggle() {
    return this._shared.notesActive;
  }

  closeNotes() {
    if (this.initNotes !== this.clientNotes) {
      this.clientNotes = this.initNotes;
    }
    this._shared.notesActive = false;
  }

  onSaveChanges() {
    const newStatus = (this.clientNotes) ? this._sList.CHANGES : this._sList.PENDING;
    if (this.initNotes !== this.clientNotes) {
      this._shared.udpateCreative(this.crvInfo, { client_notes: this.clientNotes, status: newStatus })
    }
    this._shared.notesActive = false;
  }

}
