import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { INgxMyDpOptions } from 'ngx-mydatepicker';


@Component({
    selector: 'app-value-count',
    templateUrl: './value-count.component.html',
    styleUrls: ['./value-count.component.scss']
})
export class ValueCountComponent implements OnInit {

    downloadData: any[];
    singleTotal:number = 0;
    bundleTotal:number = 0;
    totalTotal:number = 0;
    totalCount:number = 0;
    startDate:any;
    endDate:any;

    startDateOptions: INgxMyDpOptions = {};

    endDateOptions:INgxMyDpOptions = {}

    constructor(private api: ApiService) {}

    ngOnInit() {

    }

    submitDates(){

	    if(this.startDate && this.endDate){
		    this.singleTotal = 0;
		    this.bundleTotal = 0;
		    this.totalTotal = 0;
		    this.totalCount = 0;
		    this.getDataNow()
	    }

    }

    getDataNow(){
    	let url = 'sapi/manage/count/' + this.startDate.formatted + '/'+ this.endDate.formatted;
    	 this.api.getData(url).subscribe(data => {

        	this.downloadData = [];
		    for (let key in data) {
		      this.downloadData.push({'key':key, info:data[key]});
		      this.totalCount += data[key]['count'];
		      this.singleTotal += data[key]['single_price'];
		      this.bundleTotal += data[key]['bundles_price'];
		      this.totalTotal += (data[key]['single_price'] + data[key]['bundles_price'] );
		    }
        });
    }

    onStartChange(event){
    	// this.endDateOptions.showClearDateBtn = true;
    // 	this.endDateOptions['disableUntil'] = {year: event.date.year, month: event.date.month, day: event.date.day}
    // 	console.log(this.endDateOptions);
    }

}
