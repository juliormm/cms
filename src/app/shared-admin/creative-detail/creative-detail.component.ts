import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { creativeData } from '../../_interfaces/campaign.interface';


@Component({
    selector: 'creative-detail',
    templateUrl: './creative-detail.component.html',
    styleUrls: ['./creative-detail.component.scss']
})
export class CreativeDetailComponent implements OnInit {

    @Input() creative: creativeData;
    @Input() changeOptions = false;
    @Output() updateCreative: EventEmitter<creativeData> = new EventEmitter<creativeData>();
    constructor() {}

    ngOnInit() {
    	// console.log(this.creative)
    }

    onCreativeOptionsUpdate(crv: creativeData) {
    	this.updateCreative.emit(crv);
    }
}
