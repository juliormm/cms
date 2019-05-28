import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ApiService } from '../core/api.service';
import 'rxjs/add/operator/first';

@Injectable()
export class AmResolver{

  constructor(private api: ApiService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
  	let id = route.params['id'];
  	 return this.api.getData('api/am/' + id)
  	 .map(json => { 
  	 	return json
  	 }).first();
  }
}