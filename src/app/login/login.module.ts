import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoginRoutesModule } from './login-routes';

import { LoginComponent } from './login-page/login.component';


@NgModule({
  imports: [ SharedModule, LoginRoutesModule],
  declarations: [LoginComponent]
})
export class LoginModule { }
