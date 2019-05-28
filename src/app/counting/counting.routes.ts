import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValueCountComponent } from './value-count/value-count.component';
import { GoogleChartComponent } from './google-chart/google-chart.component'


const countingRoutes: Routes = [
	{ path: '', redirectTo: 'charts', pathMatch: 'full' },
    { path: 'financial', component: ValueCountComponent},
    { path: 'charts', component: GoogleChartComponent}
]

@NgModule({
    imports: [RouterModule.forChild(countingRoutes)],
    providers: [],
    exports: [RouterModule]
})
export class CoutingRoutingModule {}
