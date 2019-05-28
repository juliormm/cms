import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { INgxMyDpOptions } from 'ngx-mydatepicker';
import { ChartReadyEvent } from 'ng2-google-charts';
import { ChartErrorEvent } from 'ng2-google-charts';
import { ChartSelectEvent } from 'ng2-google-charts';

@Component({
    selector: 'app-google-chart',
    templateUrl: './google-chart.component.html',
    styleUrls: ['./google-chart.component.scss']
})
export class GoogleChartComponent implements OnInit {

    startDateOptions: INgxMyDpOptions = {};

    endDateOptions: INgxMyDpOptions = {};

    startDate: any;
    endDate: any;

    yearList = [];

    bsRangeValue: Date[] = [new Date('2018/01/01'), new Date('2018/01/31')];
    desigenerCount = [];

    lastYearSelected: number[][];

    types: boolean[] = [true, true, true, true, false, false];

    yearTypeCrvs: any = {
        chartType: 'ColumnChart',
        dataTable: [
            ['Month', 'RichMedia', 'Standard', 'Static', 'Email', 'ThirdParty', 'MEG'],
            ['Jan', 0, 0, 0, 0, 0, 0],
            ['Feb', 0, 0, 0, 0, 0, 0],
            ['Mar', 0, 0, 0, 0, 0, 0],
            ['Apr', 0, 0, 0, 0, 0, 0],
            ['May', 0, 0, 0, 0, 0, 0],
            ['Jun', 0, 0, 0, 0, 0, 0],
            ['Jul', 0, 0, 0, 0, 0, 0],
            ['Aug', 0, 0, 0, 0, 0, 0],
            ['Sep', 0, 0, 0, 0, 0, 0],
            ['Oct', 0, 0, 0, 0, 0, 0],
            ['Nov', 0, 0, 0, 0, 0, 0],
            ['Dec', 0, 0, 0, 0, 0, 0]
        ],
        options: {
            title: 'Creatives',
            // curveType: 'function',
            legend: { position: 'bottom' }
        }
    };


    yearsOverlaid: any = {
        chartType: 'LineChart',
        dataTable: [
            ['Month', '2020'],
            ['Jan', 0],
            ['Feb', 40],
            ['Mar', 0],
            ['Apr', 14],
            ['May', 67],
            ['Jun', 172],
            ['Jul', 14],
            ['Aug', 47],
            ['Sep', 55],
            ['Oct', 113],
            ['Nov', 50],
            ['Dec', 137]
        ],
        options: {
            title: 'Creatives',
            // curveType: 'function',
            legend: { position: 'bottom' }
        }
    };

    marketsTotal: number;
    marketsYear: any = {
        chartType: 'Table',
        dataTable: [
            ['Market', 'Count', 'Percent']
        ],
        options: {
            region: 'IT',
            displayMode: 'markers',
            colorAxis: { colors: ['green', 'blue'] }
        }
    };

    constructor(private api: ApiService) { }

    ngOnInit() {
        const topYear = +(new Date()).getFullYear();
         const times = topYear - 2013;
        for (var i = times; i >= 0; i--) {
           this.yearList.push(2013 + i);
        }

        this.onAllYearCreatives();
        // this.bsRangeValue = ;
    }

    onRequestDates(year) {

        this.api.getData('sapi/count/creativespermonth/' + year)
            .subscribe(data => {
                this.lastYearSelected = data;
                this.processCheckedTypes();
            });
    }

    processCheckedTypes() {
        const newData: number[][] = [];
        this.lastYearSelected.forEach((row, ri, rArr) => {
            // console.log(row);
            const tmpRow = [];
            row.forEach((col, ci, cArr) => {
                if (ci === 0) {
                    tmpRow.push(col)
                } else if (this.types[ci - 1]) {
                    tmpRow.push(col)
                }
            })
            newData.push(tmpRow);
        });

        this.yearTypeCrvs = Object.create(this.yearTypeCrvs);
        this.yearTypeCrvs.dataTable = newData;
    }

    onTypeChange(event) {
        if (this.lastYearSelected) {
            this.processCheckedTypes();
        }
    }


    onAllYearCreatives() {
        console.log('running');
        this.api.getData('sapi/count/creatives/all')
            .subscribe((data: number[][]) => {
                // console.log(data);
                const newData = [];
                data.forEach((val, i, arr) => {
                    if (i === 0) {
                        const tmpArr = [];
                        val.forEach(item => {
                            tmpArr.push(item.toString());
                        });

                        newData.push(tmpArr);
                    } else {
                        newData.push(val);
                    }
                });
                this.yearsOverlaid = Object.create(this.yearsOverlaid);
                this.yearsOverlaid.dataTable = newData;
            });
    }

    returnPerCreativeType(month: string, obj: any) {
        const arr = [];
        const rm = (obj.rm) ? obj.rm : 0;
        const standard = (obj.standard) ? obj.standard : 0;
        const stat = (obj.static) ? obj.static : 0;
        const email = (obj.email) ? obj.email : 0;
        const thirdparty = (obj.thirdparty) ? obj.thirdparty : 0;
        const meg = (obj.meg) ? obj.meg : 0;

        return [month, rm, standard, stat, email, thirdparty, meg];

    }

    onRequestDatesMarkets(value) {
        this.api.getData('sapi/count/markets/' + value)
            .subscribe((data: any[]) => {
                let total = 0;

                data.forEach((elm, idx) => {
                    total += +elm['total'];
                });
                this.marketsTotal = total;

                const temp = [['Market', 'Count', 'Percent']];

                data.forEach((elm, idx) => {
                    const perN: any = (+elm['total'] / +total) * 100;
                    temp.push([elm['market'], elm['total'], Math.round(perN * 100) / 100 + '%']);
                });

                this.marketsYear = Object.create(this.marketsYear);
                this.marketsYear.dataTable = temp;
                console.log(total)
            });
    }


    onStartChange(event) {
        // this.endDateOptions.showClearDateBtn = true;
        //     this.endDateOptions['disableUntil'] = {year: event.date.year, month: event.date.month, day: event.date.day}
        //     console.log(this.endDateOptions);
    }

    onDateRangeChange(event: Date[]) {
        if(event && event.length > 0){
            console.log(event);
            const s = this.stringDate(event[0]);
            const e = this.stringDate(event[1]);
            console.log(s, e);
       
       
       this.api.getData('sapi/count/designer/' + s + '/' + e)
            .subscribe(data => {

                const keys = Object.keys(data);

                this.desigenerCount = [];

                keys.forEach(k => {
                    this.desigenerCount.push({ key: k, campaigns: data[k].campaigns, types:data[k].types });

                });

               
                
                // this.processCheckedTypes();
            });
         }
    }

    stringDate(date: Date): string {
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        return y + '-' + m + '-' + d;
    }

    public ready(event: ChartReadyEvent) {
        console.log(event.message);
    }

    public error(event: ChartErrorEvent) {
        console.error(event);
    }

    public select(event: ChartSelectEvent) {
        // this.selectEvent = event;
    }

}
