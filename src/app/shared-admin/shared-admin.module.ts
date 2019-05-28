import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ScriptsModule } from '../scripts/scripts.module';

import { ReactiveFormsModule } from '@angular/forms';
import { TypeaheadModule, BsDropdownModule, CollapseModule, ButtonsModule, AccordionModule, BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';


import { FormAmListComponent } from './form-am-list/form-am-list.component';
import { FormClientComponent } from './form-client/form-client.component';
import { CreativeFormControllerComponent } from './creative-form-controller/creative-form-controller.component';
import { CreativeArrayComponent } from './creative-array/creative-array.component';
import { ProductionFormComponent } from './production-form/production-form.component';
import { CampaignTagsComponent } from './campaign-tags/campaign-tags.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { CreativeDetailComponent } from './creative-detail/creative-detail.component';
import { RevisionStatusDetailComponent } from './revision-status-detail/revision-status-detail.component';

import { CreativeManageComponent } from './creative-manage/creative-manage.component';


import { ProductionListService } from './production-list.service';
import { FormAmListService } from './form-am-list.service';
// import { DuplicateCreativesService } from './duplicate-creatives.service';
import { AddCreativeTrackService } from './add-creative-track.service';

// import { NotificationTrackerService } from './notification-tracker.service';
import { NotificationsComponent } from './notifications/notifications.component';
import { CreativeOptionsComponent } from './creative-options/creative-options.component';
import { CampaignDataService } from './campaign-data.service';

import { FileUploadModule } from 'ng2-file-upload';
import { AdminToolsComponent } from './admin-tools/admin-tools.component';




@NgModule({
	imports: [
		SharedModule,
		ReactiveFormsModule,
		TypeaheadModule.forRoot(),
		BsDropdownModule.forRoot(),
		CollapseModule.forRoot(),
		ButtonsModule.forRoot(),
		AccordionModule.forRoot(),
		BsDatepickerModule.forRoot(),
		TimepickerModule.forRoot(),
		NgxMyDatePickerModule,
		FileUploadModule,
		ScriptsModule],
	declarations: [FormAmListComponent, FormClientComponent, CreativeFormControllerComponent, CreativeArrayComponent, ProductionFormComponent, CampaignTagsComponent, DatePickerComponent, CreativeDetailComponent, RevisionStatusDetailComponent, NotificationsComponent, CreativeOptionsComponent, CreativeManageComponent, AdminToolsComponent],
	providers: [FormAmListService, AddCreativeTrackService, ProductionListService, CampaignDataService],
	exports: [SharedModule,
		ReactiveFormsModule,
		FormAmListComponent,
		TypeaheadModule,
		TimepickerModule,
		BsDropdownModule,
		BsDatepickerModule,
		CollapseModule,
		AccordionModule,
		ButtonsModule,
		FormClientComponent,
		CreativeFormControllerComponent,
		CreativeArrayComponent,
		ProductionFormComponent,
		CampaignTagsComponent,
		CreativeDetailComponent,
		RevisionStatusDetailComponent,
		DatePickerComponent,
		NgxMyDatePickerModule,
		NotificationsComponent,
		CreativeOptionsComponent,
		FileUploadModule,
		ScriptsModule,
		CreativeManageComponent,
		AdminToolsComponent]
})
export class SharedAdminModule { }
