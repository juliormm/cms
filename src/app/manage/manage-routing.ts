import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageEditResolver } from './manage-edit-resolver';
import { DbListComponent } from './db-list/db-list.component';
import { CampaignEditComponent } from './campaign-edit/campaign-edit.component';

const manageRoutes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: DbListComponent },
    { path: 'edit', children: [
            // { path: '', redirectTo: './list', pathMatch: 'full' },
            { path: ':cid', component: CampaignEditComponent, resolve: { campDetail: ManageEditResolver } }
        ]
    }
    // { path: 'campaign',
    //     children: [
    //         { path: '', redirectTo: 'list', pathMatch: 'full' },
    //         { path: ':id',
    //             component: CampaignDetailComponent,
    //             resolve: { campDetail: ManageResolverService },
    //             children: [
    //                 { path: ':rev', component: CampaignRevisionComponent }
    //             ]
    //         },
    //         { path: '**', redirectTo: '/list' }
    //     ]
    // }, {
    //     path: 'edit', children: [
    //         { path: ':cid', component: CampaignEditComponent, resolve: { campDetail: ManageEditResolver } }
    //     ]
    // }
]

@NgModule({
    imports: [RouterModule.forChild(manageRoutes)],
    providers: [ManageEditResolver],
    exports: [RouterModule]
})
export class ManageRoutingModule {}
