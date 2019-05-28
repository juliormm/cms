import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { creativeData } from '../../_interfaces/campaign.interface';
import { ApiService } from '../../core/api.service';
// import { ProductionSharedService } from 


@Component({
    selector: 'creative-options',
    templateUrl: './creative-options.component.html',
    styleUrls: ['./creative-options.component.scss']
})
export class CreativeOptionsComponent implements OnInit {

    // mode: update, filter
 
    @Input() allowChange: boolean = false;
    @Input() creativeDetail: creativeData;
    @Input() updateDb: boolean = false;
    @Input() displayOnly: boolean = false;
    @Input() displaySet: any;
    @Input() modeShow:string = null;
    @Output() updatedCreativeOptions: EventEmitter <creativeData> = new EventEmitter <creativeData>();
    @Output() inputChange:EventEmitter<any> = new EventEmitter<any>();


    optionValues = {
        video: { value: false, id: 1 },
        carousel: { value: false, id: 2 },
        pushdown: { value: false, id: 3 },
        gallery: { value: false, id: 2 },
        location: { value: false, id: 5 },
        expandable: { value: false, id: 6 },
        fmcontent: { value: false, id: 7 },
        map: { value: false, id: 8 },
        form: { value: false, id: 9 },
        custom: { value: false, id: 10 },
        clicktocall: { value: false, id: 11 }
    }

    constructor(private _api: ApiService) {}

    ngOnInit() {
        if (!this.displayOnly) {
            if (this.creativeDetail.features) {
                this.creativeDetail.features.forEach(val => {
                    this.optionValues[val].value = true;
                });
            }
        } else {
            for (var key in this.displaySet) {
              if (this.displaySet[key]) {
                    this.optionValues[key].value = true;
              }
            }
        }


    }

    ngOnChanges(change: SimpleChanges) {
        if (!this.displayOnly) {
            if (change['creativeDetail'].currentValue) {
                this.creativeDetail = JSON.parse(JSON.stringify(change['creativeDetail'].currentValue));
                this.setCheckBoxes();
            }
        }
    }
    showCheckbox(){
        if(this.displayOnly){
            if(this.modeShow == 'RichMedia'){
                return true;
            } else {
                return false;
            }
        } else if(this.creativeDetail && this.creativeDetail.type == 'RichMedia'){
            return true;
        } else {
            return false;
        }
    }


    setCheckBoxes() {
        Object.keys(this.optionValues).forEach(item => {
            if (this.creativeDetail.features.indexOf(item) != -1) {
                this.optionValues[item].value = true
            } else {
                this.optionValues[item].value = false
            }
        });
    }

    returnReadOnlyOptions(){
        let opts = {};
        Object.keys(this.optionValues).forEach(item => {
            opts[item] = this.optionValues[item].value;
        });

        return opts;
    }
    getFeaturesList() {
        let list: string[] = [];
        Object.keys(this.optionValues).forEach(item => {
            if (this.optionValues[item].value) {
                list.push(item);
            }
        });
        return list;
    }

    onOptionChange(event) {
        if (this.updateDb && !this.displayOnly) {
            let send = {
                campaign_id: this.creativeDetail.campaign_id,
                items: JSON.parse(JSON.stringify(this.optionValues))
            };
            this._api.updateData('sapi/manage/creative/' + this.creativeDetail.crv_id + '/features', send).subscribe(data => {

                let update: creativeData = JSON.parse(JSON.stringify(this.creativeDetail))
                update.features = this.getFeaturesList();
                this.updatedCreativeOptions.emit(update);
            });
        } else if(this.displayOnly){
            let opts = this.returnReadOnlyOptions();
            this.inputChange.emit(opts);
        }

    }

}
