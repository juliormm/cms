import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaignListComponent, CampaignRevisionComponent } from './index';
import { AmResolver } from './am.resolver';


const amRoutes: Routes = [
    { path: '', redirectTo: '/error', pathMatch: 'full' },
    { path: ':id', resolve: { campaigList: AmResolver }, component: CampaignListComponent,
        children: [
            { path: ':cID', component: CampaignRevisionComponent, pathMatch: 'full' },
            { path: '**', redirectTo: './' }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(amRoutes)],
    providers: [AmResolver],
    exports: [RouterModule]
})
export class AmRoutingModule {}
