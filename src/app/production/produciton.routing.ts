import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaignListComponent} from './campaign-list/campaign-list.component';
import { CampaignDetailComponent } from './campaign-detail/campaign-detail.component';
import { QueueComponent } from './queue/queue.component';


import { ManageResolverService } from './manage-resolver'

const productionRoutes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: CampaignListComponent },
    { path: 'queue', component: QueueComponent },
    { path: 'campaign',
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: ':id', component: CampaignDetailComponent, resolve: { campDetail: ManageResolverService } },
            { path: '**', redirectTo: '/list' }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(productionRoutes)],
    providers: [ManageResolverService],
    exports: [RouterModule]
})
export class ProductionRoutingModule {}
