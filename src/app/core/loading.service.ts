import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class LoadingService {

  private subject = new BehaviorSubject({ display: false });

  obs$ = this.subject.asObservable();

  show() {
    this.subject.next({ display: true });
  }

  hide() {
    this.subject.next({ display: false });
  }
}
