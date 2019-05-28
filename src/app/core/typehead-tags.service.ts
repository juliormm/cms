import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TypeheadTagsService {

    private tagSubject = new Subject<any>();
    tagList$ = this.tagSubject.asObservable();

    constructor(private _api: ApiService) { }

    search(value, allowEmpty = false) {
        let path;
        if (/\S/.test(value)) {
            const split = value.split(',');
            const trim = split.map(item => {
                return item.trim();
            })

            path = trim.join('/');
        } else {
            path = '';
        }

        if (/\S/.test(value) || allowEmpty) {
            this.runApi(path);
        } else {
            this.tagSubject.next([]);
        }


    }

    private runApi(path) {
        this._api.getData('sapi/search/tags/' + path, false)
            .subscribe((result: any) => {
                if ('failed' in result) {
                    this.tagSubject.next([]);
                } else {
                    this.tagSubject.next(result);
                }
            })
    }



}
