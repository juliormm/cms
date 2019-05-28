import { NgModule } from '@angular/core';
import { SharedAdminModule } from '../shared-admin/shared-admin.module'
import { ProductionRoutingModule } from './produciton.routing';
import { TooltipModule } from 'ngx-bootstrap';

import { ProductionSharedService } from './production-shared.service';

import { CampaignListComponent} from './campaign-list/campaign-list.component';
import { CampaignDetailComponent } from './campaign-detail/campaign-detail.component';
import { HideCampaignsPipe } from './hide-campaigns.pipe';
import { FilterNamePipe } from './filter-name.pipe';
import { FilterManagerPipe } from './filter-manager.pipe';
import { OrderBy } from './order-by.pipe';
import { QueueComponent } from './queue/queue.component';
import { PriorityQueuePipe } from './priority-queue.pipe';


@NgModule({
  imports: [SharedAdminModule, ProductionRoutingModule, TooltipModule.forRoot()],
  declarations: [CampaignListComponent, CampaignDetailComponent, HideCampaignsPipe, FilterNamePipe, FilterManagerPipe, OrderBy, QueueComponent, PriorityQueuePipe ],
  providers: [ ProductionSharedService  ]
})
export class ProductionModule { }
