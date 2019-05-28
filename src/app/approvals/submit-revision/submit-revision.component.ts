import { Component, Input } from '@angular/core';
import { ApprovalSharedService } from '../approval-shared.service';

@Component({
    selector: 'approval-submit-revision',
    templateUrl: './submit-revision.component.html',
    styleUrls: ['./submit-revision.component.scss']
})
export class SubmitRevisionComponent {

    @Input() insideBtn = false;
    constructor(public _shared: ApprovalSharedService) {}

    sendSubmit() {
        this._shared.updateBaseInfo({ submitted: 1 });
    }
}
