import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AlertService, IAlerts } from './alert.service';
import { environment } from '../../environments/environment';


export interface IAppVersion {
  version: number;
  checked: number;
}


@Injectable()
export class AppManageService {

  constructor(private _api: ApiService, private _alert: AlertService) {}

  validateVersion(runMany = true) {
    let cache: IAppVersion;
    try {
      cache = JSON.parse(localStorage.getItem('app_version'));
      if (typeof cache !== 'object') {
        this.runErrMessage();
      } else if (environment.appVersion < cache.version) {
        this.runErrMessage();
      } else if (environment.appVersion > cache.version) {
        this.synchErrMessage();
      } else {
        if (Date.now() - cache.checked > 86400000) {
          if (runMany) {
            this.synchWithOnline(true);
          }
        }
      }

    } catch (e) {
      this.runErrMessage();
    }
  }

  setLocalSotorage(ver) {
    const set: IAppVersion = {
      version: ver,
      checked: Date.now()
    };

    localStorage.setItem('app_version', JSON.stringify(set));
  }

  synchWithOnline(runCheck?: boolean) {
    this._api.getData('sapi/internal/app-version').subscribe(load => {
      this.setLocalSotorage(load);
      if ( runCheck ) {
        this.validateVersion(false);
      }
    })
  }

  runErrMessage() {
    const alert: IAlerts = { msg: 'Your are running an older version of this app. Please refresh the page.', dismiss: false, sticky: true, style: { 'top.px': 53, 'right': 0, 'margin': '0 auto', 'width.px': 300, 'left': 0 }, identifier: 'appversion' }
    this._alert.error(alert)
  }

  synchErrMessage() {
    const alert: IAlerts = { msg: 'Mismatch with database version! Go get Julio NOW!!!!', dismiss: false, sticky: true, style: { 'top.px': 53, 'right': 0, 'margin': '0 auto', 'width.px': 300, 'left': 0 }, identifier: 'appversion2' }
    this._alert.error(alert)
  }

}
