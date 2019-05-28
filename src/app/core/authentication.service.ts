import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { AlertService, IAlerts } from './alert.service';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../environments/environment';
import * as Auth0 from 'auth0-js';

export interface IuserMeta {
    group: string;
    is_admin: boolean;
    user: string;
}

export interface IuserData {
    app_metadata: IuserMeta;
    name: string;
    nickname: string;
    picture: string;
    sub: string;
    updated_at: string;
}

@Injectable()
export class AuthenticationService {

    private auth0 = new Auth0.WebAuth({
        domain: 'chacon.auth0.com',
        clientID: '0jELlrkL0U8LZFhvWcpkaZOE7EMcQRUd',
        scope: 'openid profile',
        responseType: 'token id_token'
    });

    private user: any;
    private returnUrl: string;
    private running = new Subject<boolean>();
    obsRunning$ = this.running.asObservable();
    jHelper: JwtHelper = new JwtHelper();




    constructor(private router: Router, private route: ActivatedRoute, private _alert: AlertService) { }

    login(username: string, password: string) {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.running.next(true);

        this.auth0.client.login({
            realm: 'Username-Password-Authentication',
            username,
            password
        }, (err, authResult) => {
            if (err) {
                console.log(err)
                const a: IAlerts = { msg: err.description, timeout: '3000' }
                this._alert.error(a);
                this.running.next(false);
                return err;
            }
            // console.warn(authResult)
            if (authResult && authResult.idToken && authResult.accessToken) {
                // localStorage.setItem('app_version', environment.appVersion);
                this.storeAuth(authResult);
                this.saveUser();

            }
        });
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('user_info');
        localStorage.removeItem('settings');
        localStorage.removeItem('app_version');
        localStorage.removeItem('notifications');
        localStorage.removeItem('search_tool');
        this.user = {};
        this.router.navigate(['/login']);
    }

    saveUser() {
        const accessToken = localStorage.getItem('access_token');
        this.auth0.client.userInfo(accessToken, (err, profile) => {
            if (profile) {
                this.user = profile;
                this.user.app_metadata = profile[environment.authMeta];
                delete this.user[environment.authMeta];
                localStorage.setItem('user_info', JSON.stringify(this.user));
                this.running.next(false);
                this.router.navigate([this.returnUrl], { relativeTo: this.route });
            } else {
                console.warn(err)
                const a: IAlerts = { msg: err.description, timeout: '3000' }
                this._alert.error(a);
                this.running.next(false);
            }
        });
    }


    isAuthenticated(): boolean {
        if (tokenNotExpired('id_token')) {
            return true;
        } else {
            return false;
        }
    }

    getUser() {
        if (this.user && Object.keys(this.user).length > 0) {
            return this.user;
        } else {
            this.user = JSON.parse(localStorage.getItem('user_info'));
            return this.user;
        }
    }


    // private loadUser() {
    //     // const u = this.jHelper.decodeToken(localStorage.getItem('id_token'));
    //     // this.user = { name: u.nickname, email: u.email };
    //     // localStorage.setItem('user_info', JSON.stringify(this.user));

    // }

    private storeAuth(authResult): void {
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
    }

}
