import { Injectable } from '@angular/core';
import { ApiService} from '../core/api.service';
import { AuthenticationService } from '../core/authentication.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';

export interface IQueueData {
    added_time: number;
    ae_name: string;
    am_name: string;
    campaign_id: number;
    client_name: string;
    phnx_id: number;
    priority: number;
    start_date: string;
    team: number;
}


@Injectable()
export class QueueDataService {

    private userInfo;
    private dataSource = new BehaviorSubject<IQueueData[]>([]);
    currentData = this.dataSource.asObservable();

    constructor(private api: ApiService, private auth: AuthenticationService) {
        this.retrieveQueueData();
        // refresh data every 2 minutes
        Observable.interval(1000 * 60 * 2).subscribe(_ => {
            this.retrieveQueueData();
        });
    }

    retrieveQueueData() {
        this.userInfo = this.auth.getUser();
        this.api.getData('sapi/manage/queue/' + this.userInfo.app_metadata.group, false).subscribe((data) => {
            if('failed' in data){
                this.dataSource.next([]);
            } else {
                this.dataSource.next(data);
            }
        });
    }
}
