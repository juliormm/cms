import { Component, OnInit } from '@angular/core';
import { IPreviewItem } from '../approval.interface';
import { ApprovalSharedService } from '../approval-shared.service'
import { CreativeTypesService } from '../../shared/creative-types.service';


@Component({
    selector: 'approval-display-panel',
    templateUrl: './display-panel.component.html',
    styleUrls: ['./display-panel.component.scss']
})
export class DisplayPanelComponent implements OnInit {

    crvInfo: IPreviewItem;
    pageSelected = 'intro';
    serverURL: string;

    constructor(public _shared: ApprovalSharedService, private crvService: CreativeTypesService) {}

    ngOnInit() {
        this.serverURL = this._shared.getServer();
        this._shared.obsSelected$.subscribe((data: IPreviewItem) => {
            if (Object.keys(data).length > 0) {
                this.crvInfo = data;
                this.pageSelected = (this.crvInfo.type === 'Email' || this.crvInfo.tag === 'Social' || !(this.crvService.showInFauxPage(this.crvInfo.type, this.crvInfo.size))) ? 'blank' : 'faux';
            }

        });
    }
}
