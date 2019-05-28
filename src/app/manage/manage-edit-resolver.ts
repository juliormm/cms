import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ApiService } from '../core/api.service';
import 'rxjs/add/operator/first';

@Injectable()
export class ManageEditResolver {

    constructor(private api: ApiService) {}
    resolve(route: ActivatedRouteSnapshot) {
        return this.api.getData('sapi/manage/campaign/' + route.params['cid'] + '/full')
            .map(json => {
                return json
            }).first();
    }
}
