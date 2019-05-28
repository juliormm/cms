import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductionModule } from '../production/production.module';
import { ManageModule } from '../manage/manage.module';
import { JobStartModule } from '../job-start/job-start.module';
import { CountingModule } from '../counting/counting.module';
import { TopNavComponent } from './top-nav/top-nav.component';
import { AppVersionGuardService } from '../core/app-version-guard.service';


const dashRoutes: Routes = [{
    path: '', component: TopNavComponent,
    children: [
        { path: '', redirectTo: 'production' },
        { path: 'data', loadChildren: '../counting/counting.module#CountingModule', canActivateChild: [AppVersionGuardService]},
        { path: 'new', loadChildren: '../job-start/job-start.module#JobStartModule', canActivateChild: [AppVersionGuardService] },
        { path: 'production', loadChildren: '../production/production.module#ProductionModule', canActivateChild: [AppVersionGuardService] },
        { path: 'manage', loadChildren: '../manage/manage.module#ManageModule', canActivateChild: [AppVersionGuardService] },
        { path: '**', redirectTo: '' }
    ]
}]

@NgModule({
    imports: [RouterModule.forChild(dashRoutes)],
    providers: [AppVersionGuardService],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
