import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';


@Component({
    selector: 'base-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {

    @Input('inDate') inDBdate:string;
    @Output('outDate') outDBdate: EventEmitter<string> = new EventEmitter<string>();
    @Input('width') _width:number;

    dateOptions: INgxMyDpOptions = {
        dateFormat: 'mmm dd, yyyy',
        showTodayBtn:true, 
        satHighlight:true,
        yearSelector:false,
        disableWeekends:true,
        selectorHeight: '200px',
        selectorWidth: '200px',
        disableHeaderButtons:false,
        disableDateRanges:this.disablePassDates()
    };

    model:any;
    setStyle:any;

    constructor() {}

    ngOnInit() {
        this.model = this.setDate(this.inDBdate);
        this.setStyle = (this._width) ? {'width': this._width + 'px'} : {};
    }


    onDateChanged(event:IMyDateModel){
        let dbReady = this.getDBdate(event.date);
        this.outDBdate.emit(dbReady);
    }

    getDBdate(date) {
        return date.year + '-' + date.month + '-' + date.day;
    }

    setDate(dtString: string) {
        if (dtString) {
            let arr: string[] = dtString.split('-');
            let dataObj = {
                date: {
                    year: parseInt(arr[0], 10),
                    month: parseInt(arr[1], 10),
                    day: parseInt(arr[2], 10),
                }
            }
            return dataObj;
        } else {
            return null;
        }
    }

    stringDate(today:Date): string {
        let y = today.getFullYear();
        let m = today.getMonth() + 1;
        let d = today.getDate();
        return y + '-' + m + '-' + d;
    }

    addDays(date:Date, days:number) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    removeDays(date:Date, days:number) {
        var result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    }

    disablePassDates(){
        let yesterday = this.removeDays(new Date(), 1);
        return [{begin: {year: 2000, month: 1, day: 1}, end: {year: yesterday.getFullYear(), month: yesterday.getMonth() + 1, day: yesterday.getDate()}}]
    }

}
