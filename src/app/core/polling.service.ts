import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { ApiService } from './api.service';


@Injectable()
export class PollingService {

  constructor(private api: ApiService) {}

  pollingURL(url: string, time = 300000, loading = true) {
    return Observable.interval(time).flatMap(() => {
      return this.api.getData(url, loading);
    })
  }
}
