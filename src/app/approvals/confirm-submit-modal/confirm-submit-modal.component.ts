import { Component, Input, Output, EventEmitter, AfterViewInit, OnInit, OnChanges, ViewChild, SimpleChanges } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'approval-modal',
  templateUrl: './confirm-submit-modal.component.html',
  styleUrls: ['./confirm-submit-modal.component.scss']
})
export class ConfirmSubmitModalComponent implements OnInit, OnChanges {

  @Input() showModal: boolean;
  @Output() submitOption = new EventEmitter();


  inited = false;
  header: string;
  message: string;
  yesBtn: boolean;
  yesTxt: string;
  noBtn: boolean;
  noTxt: string
  closeModal: boolean;

  @ViewChild('staticModal') public staticModal: ModalDirective;
  // @ViewChild('staticModal') staticModal: any;
  modConfig = { backdrop: 'static' }

  constructor() {
    this.header = 'Ready to Submit?';
    this.message = 'Do you want to Submit All and notify the team?';
    this.yesBtn = true;
    this.yesTxt = 'Yes';
    this.noBtn = true;
    this.noTxt = 'No';
    this.closeModal = false;
  }

  ngOnInit() {
    this.inited = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showModal'].currentValue) {
      if (this.inited) {
        this.show();
      } else {
        setTimeout(() => { this.show() }, 1000);
      }
    }
  }

  onYes() {
    this.staticModal.hide()
    this.submitOption.emit({ answer: 'yes' })
  }

  onNo() {
    this.staticModal.hide()
    this.submitOption.emit({ answer: 'no' })
  }

  show() {
    this.staticModal.show()
  }

}
