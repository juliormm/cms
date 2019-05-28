import { Component } from '@angular/core';
import { ApprovalSharedService } from '../approval-shared.service';
import { Router, NavigationExtras } from '@angular/router';


@Component({
    selector: 'preview-instructions',
    templateUrl: './instructions.component.html',
    styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent {

    constructor(public _shared: ApprovalSharedService, private router: Router ) {}

    onStart() {
        const navigationExtras: NavigationExtras = {
            queryParams: { 'prv': this._shared.idList[0] }
        };
        this.router.navigate(['approvals', this._shared.dData.campaign_id, this._shared.dData.rev], navigationExtras);
    }

}
