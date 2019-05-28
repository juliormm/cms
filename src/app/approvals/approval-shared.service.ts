import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IDataHolder, IPreviewItem, IPreviewData, IPreviewObjects } from './approval.interface';
import { ApiService } from '../core/api.service';
import { AlertService, IAlerts } from '../core/alert.service';
import { ApprovalStatusService } from '../core/approval-status.service';
import { environment } from '../../environments/environment';

@Injectable()
export class ApprovalSharedService {

  private subjectSelected = new BehaviorSubject({});
  private subjectAllRevised = new BehaviorSubject({ complete: false });

  dData: IPreviewData;
  valid = false;
  showSubmit = false;
  locked = false;
  notesActive = false;
  isSelected = false;
  idList: number[] = [];

  obsSelected$ = this.subjectSelected.asObservable();
  obsAllReviced$ = this.subjectAllRevised.asObservable();

  constructor(private api: ApiService, private _alert: AlertService, private statusList: ApprovalStatusService) {}

  /**
   * set selected creative
   * @param {number} id [creative id]
   */
  setSelected(id: number) {
    const found = this.findCreative(id);
    if (found) {
      this.isSelected = true;
      this.subjectSelected.next(found);
    } else {
      this.isSelected = false;
      this.subjectSelected.next({});
    }
  }

  /**
   * set dData with data
   * @param {any} data []
   */
  saveFullSync(data: IPreviewData) {
    this.dData = data;
    for (let item of data.previews) {
      for (let crv of item.items) {
        crv.versions = item.versions;
        this.idList.push(crv.prv_crv_id);
      }
    }

    if (data.submitted === 1) {
      this.showLockedMesg()
    }

    this.validateAllComplete();
  }


  showLockedMesg() {
    this.locked = true;
    this.showSubmit = false;
    const a: IAlerts = { msg: 'This preview has been submitted and can not be edited!', sticky: true }
    this._alert.error(a);
  }

  showThankYouMsg() {
    this.locked = true;
    this.showSubmit = false;
    const a: IAlerts = { msg: 'Thank You!, Our team has been notified.', sticky: true }
    this._alert.success(a);
  }

  /**
   * return true if any creative is 'pending';
   */
  validateClientCompletion() {
    for (let item of this.dData.previews) {
      for (let crv of item.items) {
        if (crv.status === this.statusList.PENDING) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * find and return match creative from the previews array
   * @param {string} type [the parent type]
   * @param {number} id   [the creative id]
   */
  findCreative(id: number, type = '') {
    for (let item of this.dData.previews) {
      // if (item.type == type) {
      for (let crv of item.items) {
        if (crv.prv_crv_id === id) {
          return crv;
        }
      }
      // }
    }
    return null;
  }

  getServer(){
    console.log(this.dData.server);
    if(this.dData.server === 'PREVIEWS'){
      return  environment.ASSETS_PREVIEW_URL;
    } else if(this.dData.server === 'QT'){
      return environment.ASSETS_QT_URL;
    } else {
      return environment.ASSETS_HYFN_URL;
    }
    // return (this.dData.server === 'PREVIEWS') ? environment.ASSETS_PREVIEW_URL : environment.ASSETS_QT_URL;
  }

  notifyTeam() {
    let amID = (this.dData.am_id) ? this.dData.am_id : 0;

    this.api.sendEmail(amID, this.dData.campaign_id, this.dData.preview_id).subscribe(
      (response) => {
        this.showThankYouMsg();
      },
      err => {
        const a: IAlerts = { msg: '<strong>There was an error notifying the team.</strong> <br>Please send us an email letting us know you have completed.<br> Thank you.' }
        this._alert.error(a);
      });
  }

  validateAllComplete() {
    const val = this.validateClientCompletion();
    if (val) {
      this.subjectAllRevised.next({ complete: true })
    } else {
      this.subjectAllRevised.next({ complete: false })
      this.showSubmit = false;
    }
  }

  /**
   * Submit to api and update local creative data
   * On success, broadcast updated changes, and validate that all creatives are revised.
   * On failed, alert error message.
   * @param {any} current [passed current select creative object]
   * @param {any} data    [object containing same keys ad current object, but with data that must change]
   */
  udpateCreative(current: IPreviewItem, data: any) {
    this.api.updateData('api/previews/creative/' + current.prv_crv_id, data).subscribe(response => {
        console.log(response);
        if (response.status === 'success') {
          const selected = this.findCreative(current.prv_crv_id, current.type);
          for (let key in data) {
            if (key in selected) {
              selected[key] = data[key];
            }
          }
          this.subjectSelected.next(selected);
          this.validateAllComplete();
        } else {
          const a: IAlerts = { msg: 'Sorry, there was an error saving your changes. Please try again' };
          this._alert.error(a);
        }
      },
      err => {
        const a: IAlerts = { msg: 'Something is not working, please contact us!' };
        this._alert.error(a);
      });
  }


  /**
   * submit to api base data changes and update local copy
   * @param {any} data [object with any keys that are in dData root]
   */
  updateBaseInfo(data: any) {
    this.api.updateData('api/previews/rev/' + this.dData.preview_id, data).subscribe(
      response => {
        if (response.status === 'success') {
          for (let key in data) {
            if (key in this.dData) {
              this.dData[key] = data[key];
            }
          }
          this.notifyTeam();
        } else {
          const a: IAlerts = { msg: 'Sorry, there was an error saving your changes. Refresh page and try again.' };
          this._alert.error(a);
        }
      },
      err => {
        const a: IAlerts = { msg: 'Something is not working, please contact us!' };
        this._alert.error(a);
      });

  }
}
