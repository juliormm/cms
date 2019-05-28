import { NgModule } from '@angular/core';
import { SharedAdminModule } from '../shared-admin/shared-admin.module'
import { DashboardRoutingModule } from './dashboard-routes';

import { TopNavComponent } from './top-nav/top-nav.component';
import { SearchDataComponent } from './search-data/search-data.component';

@NgModule({
  imports: [ SharedAdminModule, DashboardRoutingModule ],
  declarations: [TopNavComponent, SearchDataComponent]
})
export class DashboardModule { }
