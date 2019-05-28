import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../core/api.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/switchMap';
import { INgxMyDpOptions, IMyDate, IMyDateModel } from 'ngx-mydatepicker';
import { TypeheadTagsService } from '../../core/typehead-tags.service';

@Component({
    selector: 'app-db-list',
    templateUrl: './db-list.component.html',
    styleUrls: ['./db-list.component.scss']
})
export class DbListComponent implements OnInit {

    displayList: any;
    totalItems: number;
    maxSize = 10;
    @ViewChild('pagination') public pagination;
    searchBox = '';
    paginationStyle: any = {};
    startDateOptions: INgxMyDpOptions = {};
    endDateOptions: INgxMyDpOptions = {};
    yearList = [];
    filtering = false;
    settings = {
        type: 'null',
        format: { html: false, swf: false, jpg: false, png: false, gif: false },
        date: { start: null, end: null, year: null },
        meg: false,
        term: [],
        showcase: false,
        mode: 'campaign',
        options: {
            video: false,
            expandable: false,
            carouse: false,
            pushdown: false,
            gallery: false,
            location: false,
            map: false,
            fmcontent: false,
            form: false,
            custom: false
        },
        showOptions: false,
        showOptionValue: '',
        showSpecificDate: false,
        rowLimit: 10,
        currentPage: 1
    }

    defaultSettings: any;

    private searchSubject = new Subject();
    search$ = this.searchSubject.asObservable();

    tagResults = [];
    lastSearch = [];


    constructor(private api: ApiService, public _tagServ: TypeheadTagsService) {
        this.defaultSettings = JSON.parse(JSON.stringify(this.settings));
        this.loadUserSettings();
    }

    ngOnInit() {

        const topYear = +(new Date()).getFullYear();
        const times = topYear - 2013;
        for (var i = times; i >= 0; i--) {
            this.yearList.push(2013 + i);
        }


        this._tagServ.tagList$.subscribe((list: any[]) => {
            this.tagResults = list.map(item => {
                return item.tag_name;
            });
        });

        this.search$.debounceTime(500).subscribe((data: string) => {
            let temp;
            if (this.settings.mode === 'tags') {
                temp = data.toString().split(',');
                temp = temp.map(tag => { return tag.trim(); });
            } else if (this.settings.mode === 'campaign') {
                let splitBy;
                if (data.indexOf('"') > -1) {
                    splitBy = 'quote';
                    temp = data.toString().split('"');
                } else {
                    splitBy = 'space';
                    temp = data.toString().split(' ');
                }

                temp = temp.filter(tag => {
                    if (tag) {
                        return tag.replace(/,/g, '');
                    }
                });


            } else if (this.settings.mode === 'phnxid') {
                temp = [data];
             } else {
                temp = [data.toString().trim()];
            }

            this.settings.term = temp.filter(function(item, pos) {
                return temp.indexOf(item) === pos;
            });
            if (this.settings.mode === 'tags') {
                console.log('should not run')
                const exist = this.tagResults.some(pos => {
                    for (let i = 0; i < this.settings.term.length; i--) {
                        return this.settings.term[i].toLowerCase() === pos.toLowerCase();
                    }
                });

                if (exist) {
                    this.getDBlist();
                }

            } else {
                this.getDBlist();
            }

        });

        if (this.settings.currentPage !== 1) {
            const limit = this.settings.rowLimit;
            const page = (this.settings.currentPage - 1) * this.settings.rowLimit;
            this.setCurrentPage(this.settings.currentPage);
            this.getDBlist(limit, page);
        } else {
            this.getDBlist();
        }

        this.settingsChanged();
    }

    settingsChanged() {
        const baseSettings = JSON.stringify(this.defaultSettings);
        const newSettings = JSON.stringify(this.settings);
        this.filtering = (baseSettings !== newSettings) ? true : false;
    }

    saveUserSettings() {
        const sav = JSON.parse(JSON.stringify(this.settings));
        sav.term = [];
        localStorage.setItem('search_tool', JSON.stringify(sav));
        this.settingsChanged();
    }

    loadUserSettings() {
        const settings = localStorage.getItem('search_tool');
        if (settings) {
            const jset = JSON.parse(settings);
            if (Object.keys(this.settings).length === Object.keys(jset).length) {
                this.settings = jset;
            } else {
                this.settings = jset;
                this.saveUserSettings();
            }

            this.settings = jset;
        }
    }

    deleteSettings() {
        localStorage.removeItem('search_tool');
    }


    fixCenterPagination() {
        setTimeout(() => {
            this.paginationStyle = {
                'width': (this.pagination.elementRef.nativeElement.offsetWidth + 2) + 'px'
            }
        }, 1);

    }

    search(term: string) {
        // console.log(term.length);
        if (/\S/.test(term) || term.length == 0) {
            this.searchSubject.next(term);
            if (this.settings.mode === 'tags') {
                this.getListTags(term)
            }
        }

    }

    getListTags(term: string, empty = false) {
        this._tagServ.search(term, empty);
    }

    getDBlist(list?, page?) {
        let req = (list) ? '/' + list : '/' + this.settings.rowLimit;
        req += (page) ? '/' + page : '';
        this.paginationStyle = {};
        this.api.insertData('sapi/lists/campaigns' + req, this.settings).subscribe(data => {
            this.displayList = data.records;
            this.totalItems = data.total;
            this.fixCenterPagination();
            this.settingsChanged();
        })
    }

    setTypeCheckbox(base = 'null') {
        if (base === 'null') {
            this.settings.format = { html: false, swf: false, jpg: false, png: false, gif: false };
        } else if (base === 'Static') {
            this.settings.format.html = false;
            this.settings.format.swf = false;
        } else {
            this.settings.format.jpg = false;
            this.settings.format.png = false;
            this.settings.format.gif = false;
        }
    }

    toggleOptions() {
        this.saveUserSettings();
        this.getDBlist();
    }

    onRequestDates(year) {
        this.saveUserSettings();
        if (year === 'null') {
            this.settings.date.year = null;
            this.settings.showSpecificDate = false;
            this.settings.date.start = null;
            this.settings.date.end = null;
            this.getDBlist();
        } else if (year !== 'month') {
            this.settings.showSpecificDate = false;
            this.settings.date.start = null;
            this.settings.date.end = null;
            this.getDBlist();
        } else {
            this.settings.showSpecificDate = true;
        }

    }
    onUpdateType(event) {
        this.setTypeCheckbox(event.target.value);

        if (event.target.value === 'RichMedia' || event.target.value === 'Standard') {
            this.settings.showOptions = true;
            this.settings.showOptionValue = event.target.value;
        } else {
            this.settings.showOptions = false;
            this.settings.showOptionValue = null;
        }
        this.saveUserSettings();
        this.getDBlist();
    }
    onUpdateFilter(event) {
        const pick = event.target.name;
        if (pick === 'HTML5' || pick === 'Flash') {
            this.settings.format.jpg = false;
            this.settings.format.png = false;
            this.settings.format.gif = false;
        } else {
            this.settings.format.html = false;
            this.settings.format.swf = false;
        }
        this.saveUserSettings();
        this.getDBlist();
    }

    onChangeLimit(event) {
        this.setCurrentPage(1);
        this.settings.rowLimit = event.target.value;
        this.saveUserSettings();
        this.getDBlist(this.settings.rowLimit, 0);
    }

    setCurrentPage(num) {
        this.pagination.page = this.settings.currentPage = num;
    }

    onPageChanged(event, clicked) {
        if (clicked) {
            const limit = event['itemsPerPage'];
            const page = (event['page'] - 1) * this.settings.rowLimit;
            this.settings.currentPage = event['page'];
            this.saveUserSettings();
            this.getDBlist(limit, page);
        }
    }

    onStartDateChange(event: IMyDateModel) {
        this.settings.date.start = event.formatted;
        const copy = JSON.parse(JSON.stringify(this.endDateOptions));
        copy.disableUntil = event.date
        this.endDateOptions = copy;
        this.validateRunDate();
    }

    onEndDateChange(event) {
        this.settings.date.end = event.formatted;
        this.validateRunDate();
    }

    validateRunDate() {
        if (this.settings.date.start && this.settings.date.end) {
            this.saveUserSettings();
            this.getDBlist();
        }
    }


    onOptionChange(options) {
        this.settings.options = options;
        this.saveUserSettings();
        this.getDBlist();
    }

    onSearchModeChange() {
        if (this.searchBox) {
            this.saveUserSettings();
            this.getDBlist();
        }
        if (this.settings.mode === 'tags' && this.tagResults.length === 0) {
            this.getListTags('', true)
        }
    }

    onResetAll() {
        this.deleteSettings();
        this.searchBox = '';
        this.settings = JSON.parse(JSON.stringify(this.defaultSettings));

        const limit = this.settings.rowLimit;
        const page = (this.settings.currentPage - 1) * this.settings.rowLimit;
        this.setCurrentPage(this.settings.currentPage);
        this.getDBlist(limit, page);
        this.settingsChanged();
    }

}
