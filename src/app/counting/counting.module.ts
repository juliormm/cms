import { NgModule } from '@angular/core';
import { SharedAdminModule } from '../shared-admin/shared-admin.module';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { ValueCountComponent } from './value-count/value-count.component';
import { CoutingRoutingModule } from './counting.routes';
import { GoogleChartComponent } from './google-chart/google-chart.component';

@NgModule({
  imports: [CoutingRoutingModule, SharedAdminModule, Ng2GoogleChartsModule ],
  declarations: [ValueCountComponent, GoogleChartComponent]
})
export class CountingModule { }
