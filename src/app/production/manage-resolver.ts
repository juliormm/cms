import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ApiService } from '../core/api.service';
import { ProductionSharedService } from './production-shared.service';
import 'rxjs/add/operator/first';

@Injectable()
export class ManageResolverService {

    constructor(private api: ApiService, private shared: ProductionSharedService) {}
    resolve(route: ActivatedRouteSnapshot) {
        // we might want to check if data was already saved and return that, must return obserbable
        return this.api.getData('sapi/manage/campaign/' + route.params['id'])
            .map(json => {
                return json
            }).first();
    }
}
