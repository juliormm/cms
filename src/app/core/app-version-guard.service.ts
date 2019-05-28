import { Injectable } from '@angular/core';
import { Router, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppManageService } from './app-manage.service';
import { environment } from '../../environments/environment'


@Injectable()
export class AppVersionGuardService implements CanActivateChild {

  constructor(private router: Router, private app: AppManageService) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    this.app.validateVersion();
    // console.log(check);

    return true;

  }

}
