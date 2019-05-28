import { Injectable, SecurityContext } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
import { WindowRefService } from './window-ref.service';

export interface IAlerts {
    type?: string;
    msg?: string;
    dismiss?: boolean;
    timeout?: string;
    sticky?: boolean;
    style?: any;
    clearAll?: boolean;
    identifier?: string;
};


@Injectable()
export class AlertService {
    private alertSubject = new Subject<any>();
    private listSubject = new Subject<any>();
    private removeAllSubject = new Subject<any>();
    private moduleBase = '';
    private lastUrl = '';
    _window: Window;


    alert$ = this.alertSubject.asObservable();
    alertList$ = this.listSubject.asObservable();
    alertRemoveAll$ = this.removeAllSubject.asObservable();
    fixedIds = [];


    constructor(private router: Router, private sanitizer: DomSanitizer, private windowRef: WindowRefService) {
        this.moduleBase = router.url.split('/')[0];
        this._window = windowRef.nativeWindow;
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (this.moduleBase !== event.url.split('/')[0]) {
                    // clearing all because of module change
                    this.removeAll();
                }

                if (this.lastUrl !== event.url) {
                    // remove non sticky
                    this.listSubject.next();
                }

                this.lastUrl = event.url;
            }
        });
    }



    success(data: IAlerts) {
        const m = this.alertParse(data);
        m.type = 'success';
        this.alertSubject.next(m);
    }

    error(data: IAlerts) {
        console.log('sending error');
        const m = this.alertParse(data);
        m.type = 'danger';
        this.alertSubject.next(m);
    }

    alertParse(data: IAlerts) {
        const _msg = (data.msg) ? this.cleanHTML(data.msg) : null;
        const _dis = (data.dismiss) ? data.dismiss : true;
        const _time = (data.timeout) ? data.timeout : null;
        const _stick = (data.sticky) ? data.sticky : false;
        const _style = (data.style) ? data.style : {};
        const _identifier = (data.identifier) ? data.identifier : null;

        const compiled: IAlerts = { msg: _msg, dismiss: _dis, timeout: _time, sticky: _stick, style: _style, identifier: _identifier };

        return compiled;
    }


    removeAll() {
        this.removeAllSubject.next({});
    }


    reloadPage() {
        this._window.location.reload(true);
    }

    cleanHTML(message: string) {
        return this.sanitizer.sanitize(SecurityContext.HTML, message);
    }
}
