import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoPageFoundComponent } from './shared/no-page-found/no-page-found.component';
import { AuthGuardService } from './core/auth-guard.service';
import { ApprovalsModule } from './approvals/approvals.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AccountManagerModule } from './am/am.module';
import { LoginModule } from './login/login.module'

const appRoutes: Routes = [
    { path: 'approvals', loadChildren: './approvals/approvals.module#ApprovalsModule' },
    { path: 'dashboard', canActivate: [AuthGuardService], loadChildren: './dashboard/dashboard.module#DashboardModule' },
    { path: 'am', loadChildren: './am/am.module#AccountManagerModule' },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', component: NoPageFoundComponent }
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    providers: [
        AuthGuardService
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
