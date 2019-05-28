import { NgModule } from '@angular/core';
import { ManageRoutingModule } from './manage-routing';
import { SharedAdminModule } from '../shared-admin/shared-admin.module'

import { PaginationModule } from 'ngx-bootstrap';

import { CampaignEditComponent } from './campaign-edit/campaign-edit.component';
import { DbListComponent } from './db-list/db-list.component';
import { ManageCampaignService } from './manage-campaign.service';


@NgModule({
  imports: [SharedAdminModule, ManageRoutingModule, PaginationModule.forRoot()],
  declarations: [CampaignEditComponent, DbListComponent ],
  providers: [ ManageCampaignService ]
})
export class ManageModule { }
