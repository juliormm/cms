import { Component, HostListener, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApprovalSharedService } from '../approval-shared.service'
import { IPreviewItem } from '../approval.interface'
import { environment } from '../../../environments/environment';
import { PreviewAdComponent } from '../../shared/preview-ad/preview-ad.component';


@Component({
    selector: 'faux-page',
    templateUrl: './faux-page.component.html',
    styleUrls: ['./faux-page.component.scss']
})
export class FauxPageComponent implements OnInit {

    private baseURL = '';
    crvDetail: IPreviewItem;
    mobileMode = false;
    isStatic = false;
    useFrame: boolean

     @ViewChild(PreviewAdComponent)
     private previewBlock: PreviewAdComponent;


    constructor(private sanitizer: DomSanitizer, public _shared: ApprovalSharedService, private el: ElementRef) { }
    ngOnInit() {
        this.baseURL = this._shared.getServer();
        this._shared.obsSelected$.subscribe((data: IPreviewItem) => {
            this.crvDetail = data;
            this.mobileMode = (this.crvDetail.tag === 'Mobile') ? true : false;
            this.useFrame = this.checkIfHTML();
            this.isStatic = !this.useFrame;
        });
    }

    onReplayButton() {
        this.previewBlock.restartAd();
    }

    getClass() {
        return 'ad-' + this.crvDetail.size;
    }

    checkIfHTML(): boolean {
        return (this.crvDetail.url_path.indexOf('.htm') >= 0) ? true : false;
    }

}
