import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApprovalResolver } from './approval.resolver';
import { MainComponent } from './main/main.component';
// import { CreativeComponent } from './creative/creative.component';

const approvalRoutes: Routes = [{
    path: ':campaign',
    children: [
      { path: ':rev', pathMatch: 'full', component: MainComponent, resolve: { apiStuff: ApprovalResolver } }
    ]
  },
  // { path: 'creative/:prev_id', component: CreativeComponent},
  { path: '', redirectTo: '/approvals/0/0', pathMatch: 'full' },
  { path: '**', redirectTo: '/approvals/0/0' }
]

@NgModule({
  imports: [RouterModule.forChild(approvalRoutes)],
  providers: [ApprovalResolver],
  exports: [RouterModule]
})
export class ApprovalRoutingModule {}
