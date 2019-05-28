import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoadingService } from './loading.service';
import { ApiService,
        AlertService,
        ApprovalStatusService,
        AuthenticationService,
        AuthGuardService,
        QueueDataService} from './index-service';
import { DynamicModalService } from './dynamic-modal.service';
import { PollingService } from './polling.service';
import { NotificationTrackerService } from './notification-tracker.service';
import { WindowRefService } from './window-ref.service';
import { AppManageService } from './app-manage.service';
import { TypeheadTagsService } from './typehead-tags.service';
import { Ng2PageScrollModule } from 'ng2-page-scroll';


// import { AngularFireModule } from 'angularfire2';

// // New imports to update based on AngularFire2 version 4
// import { AngularFireDatabaseModule } from 'angularfire2/database';
// import { AngularFireAuthModule } from 'angularfire2/auth';

// export const firebaseConfig = {
//     apiKey: "AIzaSyDyLxGaUaCJIIqwUj8f0jI82ogAtFwamjg",
//     authDomain: "creative-cms-6e464.firebaseapp.com",
//     databaseURL: "https://creative-cms-6e464.firebaseio.com",
//     projectId: "creative-cms-6e464",
//     storageBucket: "creative-cms-6e464.appspot.com",
//     messagingSenderId: "765355562100"
// };


@NgModule({
    imports: [ 
    SharedModule, 
    Ng2PageScrollModule.forRoot()
    // AngularFireModule.initializeApp(firebaseConfig),
    // AngularFireDatabaseModule,
    // AngularFireAuthModule 
    ],
    declarations: [],
    exports: [SharedModule, Ng2PageScrollModule]
})
export class CoreModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [ApiService, AuthenticationService, AuthGuardService, AlertService, ApprovalStatusService, QueueDataService, LoadingService, DynamicModalService, PollingService, NotificationTrackerService, AppManageService, WindowRefService, TypeheadTagsService]
        };
    }

    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
