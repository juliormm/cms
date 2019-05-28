import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MainComponent, FauxPageComponent, NotesComponent, NavigationComponent, HeaderComponent, FooterComponent, InstructionsComponent, ConfirmSubmitModalComponent, StatusBtnsComponent, DisplayPanelComponent, SubmitRevisionComponent } from './index';
import { ApprovalSharedService } from './approval-shared.service';
import { ApprovalRoutingModule } from './approval.routing';


@NgModule({
  imports: [SharedModule, ApprovalRoutingModule],
  declarations: [
    MainComponent,
    FauxPageComponent,
    NotesComponent,
    NavigationComponent,
    HeaderComponent,
    FooterComponent,
    InstructionsComponent,
    ConfirmSubmitModalComponent,
    StatusBtnsComponent,
    DisplayPanelComponent,
    SubmitRevisionComponent
  ],
  providers: [ApprovalSharedService]
})
export class ApprovalsModule {}
