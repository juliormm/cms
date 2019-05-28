import { Injectable, SecurityContext } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { IAlerts, AlertService } from './alert.service';
import { DomSanitizer } from '@angular/platform-browser';


export interface INotifications {
    notifier: string;
    title: string;
    message: string;
    dismissDate?: number;
    cache?: boolean;
    alert_data?: IAlerts;
    alert_active?: boolean;
}

export interface INotificationIgnore {
    notifier: string;
    dismissDate: number;
}

@Injectable()
export class NotificationTrackerService {

    private notificationSubject = new Subject<any>();
    private displaySubject = new Subject<any>();

    private oneWeekAgo = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);

    notificationChange$ = this.notificationSubject.asObservable();
    displayListener$ = this.displaySubject.asObservable();

    notifications: INotifications[] = [];
    ignoreList: INotificationIgnore[];
    // today: Date = new Date();

    constructor(private _alert: AlertService, private sanitizer: DomSanitizer) {
        const loadNoti: INotificationIgnore[] = JSON.parse(localStorage.getItem('notifications'));
        this.ignoreList = (loadNoti) ? loadNoti : [];
    }


    addNotification(n: INotifications) {

        if (this.validNotification(n)) {
            if (n.message) {
                n.message = this.sanatizeText(n.message);
            }
            if (n.title) {
                n.title = this.sanatizeText(n.title);
            }

            this.notifications.push(n);
            this.notificationSubject.next({});
            if (n.alert_active && n.alert_data) {
                if (n.alert_data.type === 'error') {
                    this._alert.error(n.alert_data);
                } else {
                    this._alert.success(n.alert_data);
                }
            }
        }
    }

    deleteNotification(id: string, cache = false) {
        const idx = this.notifications.findIndex(elm => {
            return elm.notifier === id;
        });

        if (this.notifications[idx].cache) {
            this.ignoreList.push({ notifier: id, dismissDate: Date.now() });
            localStorage.setItem('notifications', JSON.stringify(this.ignoreList));
        }
        this.notifications.splice(idx, 1);
        this.notificationSubject.next({});
    }

    sanatizeText(txt: string) {
        return this.sanitizer.sanitize(SecurityContext.HTML, txt);
    }

    removeIgnoreNotification(n: INotifications) {
        const curr: INotificationIgnore[] = JSON.parse(localStorage.getItem('notifications'));
        this.ignoreList = curr.filter(elm => {
            return elm.notifier !== n.notifier;
        });
        localStorage.setItem('notifications', JSON.stringify(this.ignoreList));
    }

    closeNotifications() {
        this.displaySubject.next('close');
    }

    openNotifications() {
        this.displaySubject.next('open');
    }

    validNotification(n: INotifications) {
        const found = this.notifications.some(elem => {
            return elem.notifier === n.notifier;
        });

        if (found) {
            return false;
        }
        const ignore = this.ignoreList.find((elem, idx) => {
            return elem.notifier === n.notifier;
        });
        if (ignore) {
            if (ignore.dismissDate < this.oneWeekAgo) {
                console.log('remove cache')
                this.removeIgnoreNotification(n);
                return true;
            }
        }

        return (!found && !ignore) ? true : false;
    }

}
