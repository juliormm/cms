import { Component } from '@angular/core';
import { AlertService, IAlerts } from '../../core/alert.service';

@Component({
    selector: 'app-lin-alert',
    template: `
        <div class="alert-base-position" [ngStyle]="uStayle">
            <div *ngFor="let alert of alerts; let i=index" class="items-list">
                <alert [type]="alert.type" [dismissible]="alert.dismiss ? true : false" [dismissOnTimeout]="alert.timeout ? alert.timeout : null" (onClosed)="onCloseAlert($event, i)"><span [innerHtml]="alert.msg"></span></alert>
            </div>
        </div>
    `,
    styleUrls: ['./alert.component.scss']
})
export class AlertComponent {

    alerts: IAlerts[] = [];
    uStayle: any = {};
    constructor(private alertService: AlertService) {
        this.alertService.alert$.subscribe(newAlert => {

            const found = this.alerts.find(item => {
                return  item.identifier === newAlert.identifier && item.identifier != null;
            });

            if (found) { return null }

            const next = this.alerts.length + 1;
            newAlert.id = next;
            this.alerts.push(newAlert);

            if (newAlert.hasOwnProperty('style')) {
                this.uStayle = newAlert.style;
            }

        });

        this.alertService.alertRemoveAll$.subscribe(data => {
            this.alerts.length = 0;
        });

        // removes all non sticky alerts on nav change
        this.alertService.alertList$.subscribe(event => {
            this.alerts = this.alerts.filter(el => {
                return el.sticky;
            })
        });
    }

    onCloseAlert(e, i) {
        this.alerts.splice(i, 1);
    }

    centerNav() {
        // const s = {'top.px': 53, 'right': 0, 'left': 0, 'margin': '0 auto', 'width.px': 300};
    }
}
