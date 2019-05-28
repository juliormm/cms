import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/authentication.service';
import { NotificationTrackerService } from '../../core/notification-tracker.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AlertService, IAlerts } from '../../core/alert.service';
import { QueueDataService, IQueueData } from '../../core/queue-data.service';
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'app-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

    userInfo: any = {};
    subscriptions: Subscription;
    isIn = false; // store state
    cacheAppVersion: string;
    appVersion = environment.appVersion;
    itemsInQueue: number;

    constructor(
        private auth: AuthenticationService,
        public _notify: NotificationTrackerService,
        private router: Router,
        private _alert: AlertService,
        private queueService: QueueDataService) {
    }

    ngOnInit() {
        this.userInfo = this.auth.getUser();
        this.subscriptions = new Subscription();

        this.subscriptions.add(this.queueService.currentData.subscribe(data => this.itemsInQueue = data.length));
    }

    logout() {
        this.auth.logout();
    }

    toggleState() { // click handler
        const bool = this.isIn;
        this.isIn = bool === false ? true : false;
    }

    toggleNotifications() {
        this._notify.openNotifications();
    }

    ngOnDestroy(){
        this.userInfo = null;
        this.subscriptions.unsubscribe();
    }

}
