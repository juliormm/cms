import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewProjectComponent } from './new-project/new-project.component';



const jobStartRoutes: Routes = [
    { path: '', component: NewProjectComponent}
]

@NgModule({
    imports: [RouterModule.forChild(jobStartRoutes)],
    providers: [],
    exports: [RouterModule]
})
export class JobStartRoutingModule {}
