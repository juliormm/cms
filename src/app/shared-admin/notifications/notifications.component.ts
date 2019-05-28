import { Component, OnInit } from '@angular/core';
import { NotificationTrackerService, INotifications } from '../../core/notification-tracker.service';

@Component({
    selector: 'lin-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

	navStyle:any = {};

    constructor(public _notify:NotificationTrackerService) {}

    ngOnInit() {
        this._notify.displayListener$.subscribe(status => {
            if(status == 'open'){
                this.onOpenNav()
            }

            if(status == 'close'){
                this.onCloseNav()
            }
        });
    }

    onCloseNav(){
        this.navStyle = {'width.px': '0'};
    }

    onOpenNav(){
        this.navStyle = {'width.px': '400'};
    }

    onRemoveNotification(event:INotifications){
        console.log(event);
        this._notify.deleteNotification(event.notifier);
        if(this._notify.notifications.length == 0){
            this.onCloseNav();
        }
    }
}
