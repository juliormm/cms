import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { environment } from '../../environments/environment'
import { LoadingService } from './loading.service';
import { AlertService, IAlerts } from './alert.service';

@Injectable()
export class ApiService {

    private baseUrl: string = environment.API_URL;

    constructor(private http: Http, private loading: LoadingService, private _alert: AlertService) { }

    getPhnxData(path: string, loading = true, secure = true) {
        // const PNXdata = new FormData();
        return this.http.get(this.baseUrl + `${path}`, this.jwt('get', secure))
            .map((response: Response) => {
                const r = response.json();
                this.loading.hide();
                return r;
            })
            .catch((response: Response) => {
                const errMsg = this.handleError(response);
                this.loading.hide();

                return Observable.throw(errMsg);
            });
    }

    getData(path: string, loading = true, secure = true, getError = false) {
        if (loading) { this.showLoading() };
        return this.http.get(this.baseUrl + `${path}`, this.jwt('get', secure))
            .map((response: Response) => {
                const r = this.extractData(response, getError);
                this.loading.hide();
                return r;
            })
            .catch((response: Response) => {
                const errMsg = this.handleError(response);
                this.loading.hide();
                this.alertErrMsg({url: path, error: errMsg});
                return Observable.throw(errMsg);
            });
    }

    updateData(path: string, data: any, loading = true, secure = true, getError = false) {
        if (loading) { this.showLoading() };
        return this.http.put(this.baseUrl + `${path}`, JSON.stringify(data), this.jwt('put', secure))
            .map((response: Response) => {
                const r = this.extractData(response, getError);
                this.loading.hide();
                return r;
            })
            .catch((response: Response) => {
                const errMsg = this.handleError(response);
                this.loading.hide();
                this.alertErrMsg({url: path, content: data, error: errMsg});
                return Observable.throw(errMsg);
            });
    }

    deleteData(path: string, loading = true, secure = true, getError = false) {
        if (loading) { this.showLoading() };
        return this.http.delete(this.baseUrl + `${path}`, this.jwt('put', secure))
            .map((response: Response) => {
                const r = this.extractData(response, getError);
                this.loading.hide();
                return r;
            })
            .catch((response: Response) => {
                const errMsg = this.handleError(response);
                this.loading.hide();
                this.alertErrMsg({url: path, error: errMsg});
                return Observable.throw(errMsg);
            });
    }

    insertData(path: string, data: any, getError = false, secure = true, loading = true) {
        if (loading) { this.showLoading() };
        return this.http.post(this.baseUrl + `${path}`, JSON.stringify(data), this.jwt('put', secure))
            .map((response: Response) => {
                const r = this.extractData(response, getError);
                this.loading.hide();
                return r;
            })
            .catch((response: Response) => {
                const errMsg = this.handleError(response);
                this.loading.hide();
                this.alertErrMsg({url: path, content: data, error: errMsg});
                return Observable.throw(errMsg);
            });
    }

    sendEmail(amId: number, campId: number, rev: number, loading = true, secure = true, getError = false) {
        if (loading) { this.showLoading() };
        return this.http.get(this.baseUrl + `tools/email/${amId}/${campId}/${rev}`, this.jwt('get', secure))
            .map((response: Response) => {
                const data = this.extractData(response, getError);
                this.loading.hide();
                return data;
            })
            .catch((response: Response) => {
                const errMsg = this.handleError(response);
                this.loading.hide();
                return Observable.throw(errMsg);
            });
    }

    showLoading() {
        this.loading.show();
    }
    hideLoading() {
        this.loading.hide();
    }

    private sendErrMessage(data) {
        this.http.post(this.baseUrl + 'sapi/admin/email/errors', JSON.stringify(data), this.jwt('put', true))
            .subscribe(resp => {
                console.log('error message sent');
            });
    }

    private alertErrMsg(emailMsg) {
        const aErr: IAlerts = {
            msg: `<h4>The last action could not be completed.</h4>
                <p>If you are seeing this message is because there is something wrong with the app. </p>
                <p>The admin has been notify of the error. </p>
                <p>Contact Julio if you need to resolve this now.</p>`,
            dismiss: true,
            style: { 'width.px': '300', 'right': 0, 'left': 0, 'margin': '0 auto' }
        };
        this._alert.error(aErr);
        if ( environment.envName !== 'dev') {
             this.sendErrMessage(emailMsg);
        }
    }

    private jwt(type: string, secure = true): any {
        const currentUser = localStorage.getItem('id_token');
        const headers = new Headers({ 'Accept': 'application/json' });
        if (secure && currentUser) {
            headers.append('Authorization', `Bearer ${currentUser}`);
        }

        if (type === 'put' || type === 'post') {
            headers.append('Content-Type', 'application/json');
        }

        if (type = 'form') {
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
        }

        return new RequestOptions({ headers: headers });
    }

    private extractData(res: Response, getErr?: boolean) {
        // console.log(res)
        const body = res.json();
        if (getErr) {
            return body;
        }
        if (body.status === 'success') {
            return (body.data) ? body.data : body;
        } else {

            return { failed: true }
        }
    }

    private handleError(error: Response | any) {
        console.log(error);
        let errMsg: string;
        const criticalError = 'Sorry, something went wrong, contact the admin';
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || criticalError;
            errMsg = err || error.statusText;
            // errMsg = err;
            if (err === criticalError) {
                console.log(body);
            }
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return { failed: errMsg };
        // return Observable.throw(errMsg);
    }

}
