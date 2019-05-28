import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ModalModule, AlertModule } from 'ngx-bootstrap';
import { NgArrayPipesModule } from 'ngx-pipes';


import { CleanTypeNamePipe } from './clean-type-name.pipe';
import { EllipsisTextPipe } from './ellipsis-text.pipe';
import { NiceBoolPipe } from './nice-bool.pipe';

import { CreativeTypesService } from './creative-types.service';

import { NoPageFoundComponent } from './no-page-found/no-page-found.component';
import { DemoMessageComponent } from './demo-message/demo-message.component';
import { AlertComponent } from './alert/alert.component';
import { LoadingComponent } from './loading/loading.component';
import { PreviewAdComponent } from './preview-ad/preview-ad.component';
import { ModalYesNoComponent } from './modal-yes-no/modal-yes-no.component';
import { ModalLoadingComponent } from './modal-loading/modal-loading.component';
import { CreativesByTypePipe } from './creatives-by-type.pipe';
import { MapToIterablePipe } from './map-to-iterable.pipe';



@NgModule({
	imports: [CommonModule, FormsModule, HttpModule, ModalModule.forRoot(), AlertModule.forRoot(), NgArrayPipesModule],
	declarations: [
        CleanTypeNamePipe,
        EllipsisTextPipe,
        NiceBoolPipe,
        NoPageFoundComponent,
        DemoMessageComponent,
        AlertComponent,
        LoadingComponent,
        PreviewAdComponent,
        ModalLoadingComponent,
        ModalYesNoComponent,
        CreativesByTypePipe,
        MapToIterablePipe
    ],
	providers: [CreativeTypesService],

	entryComponents: [ModalYesNoComponent],
	exports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ModalModule,
        AlertModule,
        CleanTypeNamePipe,
        EllipsisTextPipe,
        NiceBoolPipe,
        NoPageFoundComponent,
        DemoMessageComponent,
        AlertComponent,
        LoadingComponent,
        PreviewAdComponent,
        ModalLoadingComponent,
        ModalYesNoComponent,
        NgArrayPipesModule,
        CreativesByTypePipe,
        MapToIterablePipe
    ]
})
export class SharedModule { }
