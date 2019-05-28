import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ApiService } from '../core/api.service';
import 'rxjs/add/operator/first';

@Injectable()
export class ApprovalResolver {

  constructor(private api: ApiService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.api.getData('api/campaigns/' + route.params['campaign'] + '/previews/' + route.params['rev'])
      .map(json => {
        return json
      }).first();
  }
}
