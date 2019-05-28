import { NgModule } from '@angular/core';
import { SharedAdminModule } from '../shared-admin/shared-admin.module';
import { JobStartRoutingModule } from './job.routing';

import { NewProjectComponent } from './new-project/new-project.component';

@NgModule({
  imports: [ SharedAdminModule, JobStartRoutingModule ],
  declarations: [NewProjectComponent]
})
export class JobStartModule { }
