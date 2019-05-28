import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApprovalSharedService } from '../approval-shared.service';

@Component({
    selector: 'approval-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    @Input() menuOpen: boolean;
    @Output() toggleNav = new EventEmitter();

    constructor(public _shared: ApprovalSharedService){}

    onToggleNav() {
        this.toggleNav.emit();
    }

}
