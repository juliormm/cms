import { NgModule } from '@angular/core';
import { AmRoutingModule } from './am-routing';
import { SharedAdminModule } from '../shared-admin/shared-admin.module';

import { CampaignListComponent, CampaignRevisionComponent} from './index';

import { AmSharedService } from './am-shared.service';


@NgModule({
  imports: [SharedAdminModule, AmRoutingModule],
  declarations: [CampaignListComponent, CampaignRevisionComponent],
  providers:[AmSharedService]
})
export class AccountManagerModule { }
