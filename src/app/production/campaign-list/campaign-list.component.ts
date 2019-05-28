import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, AfterViewInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, Params, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { ApiService } from '../../core/api.service';
import { AlertService, IAlerts } from '../../core/alert.service'
import { PollingService } from '../../core/polling.service';
import { ApprovalStatusService } from '../../core/approval-status.service';
import { ProductionListService } from '../../shared-admin/production-list.service';
import { NotificationTrackerService, INotifications } from '../../core/notification-tracker.service';
import { AuthenticationService, IuserData } from '../../core/authentication.service';

import { campaignData } from '../../_interfaces/campaign.interface';

export interface IProductionListTableItem {
    hidden: number;
    id: number;
    data: campaignData;
    notes: string;
    date: Date;
    prev_status?: string;
    server_name: string;
    manager: string;
    ae_name: string;
    templates: string;
}


@Component({
    templateUrl: './campaign-list.component.html',
    styleUrls: ['./campaign-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignListComponent implements OnInit, OnDestroy {
    changeTracking: any = {};
    trackData: IProductionListTableItem[];
    searchRecover: any[];
    showHidden: false;
    sortConfig: any = {
        sortBy: '',
        sortParent: '',
        sortDir: 0,
        refresh: false,
        refreshInterval: 10,
        showHidden: false,
        manager: 'all'
    }
    oldCampaignsList: string[] = [];
    oldCampaigns = 6;

    dueDateStartDate = 'Due Date';

    notifications = [];

    pagepoll: Subscription;

    alertPos = { 'top.px': 56, 'right': 'auto' };

    searchBox = '';
    userInfo: IuserData;
    todayIs = new Date();
    ae_filter = 'all';
    aeList = [];
    sortCampaignByUser : string;
    sortParentByUser: string;
    // managerTxt = 'unassigned'
    // searchTxt = '';

    // private searchSubject = new Subject();
    // search$ = this.searchSubject.asObservable();

    constructor(private ngZone: NgZone,
        private ref: ChangeDetectorRef,
        public _notify: NotificationTrackerService,
        private api: ApiService,
        private router: Router,
        private _status: ApprovalStatusService,
        public _lists: ProductionListService,
        private polling: PollingService,
        private auth: AuthenticationService) {
        this.loadCustomView();
    }

    ngOnInit() {
        this.todayIs.setHours(0, 0, 0, 0);
        this.userInfo = this.auth.getUser();
        this.sortCampaignByUser = (this.userInfo.app_metadata.group !== 'theorem-creative') ? 'client_name' : 'campaign_name';
        this.sortParentByUser = (this.userInfo.app_metadata.group !== 'theorem-creative') ? 'client' : '';

        this.api.getData('sapi/manage/active/' + this.userInfo.app_metadata.group).subscribe((data: campaignData[]) => {
            this.trackData = [];
            this.changeTracking = {};
            const runSort = (this.sortConfig.sortBy) ? true : false;
            this.indexData(data, runSort);

            if (this.oldCampaignsList.length > 0) {
                const clist = this.oldCampaignsList.join('<br>');
                const _msg = '<strong>The following hidden campaigns are older then ' + this.oldCampaigns + ' months. You should consider archiving these campaigns.</strong></br>' + clist;
                this._notify.addNotification({ notifier: 'camp-list-old', title: 'Old Projects Detected', message: _msg, cache: true });
            }
            this.ref.markForCheck();
        });

        if (this.sortConfig.manager === 'unassigned') {
            this.dueDateStartDate = 'Date Added';
        } else {
            this.dueDateStartDate = 'Due Date';
        }

        if (this.sortConfig.refresh) {
            this.startPolling();
        }

        // this.search$.debounceTime(200).subscribe((data: string) => { 

        //     this.searchTxt = data;
        // });

    }

    ngOnDestroy() {
        if (this.pagepoll) {
            this.pagepoll.unsubscribe();
        }
    }

    startPolling() {
        if (this.pagepoll) {
            this.pagepoll.unsubscribe();
        }
        const time = this.sortConfig.refreshInterval * 60000;
        this.pagepoll = this.polling.pollingURL('sapi/manage/active/' + this.userInfo.app_metadata.group, time, false).subscribe(data => {
            // this.changeTracking = this.trackData;
            this.trackData = [];
            this.indexData(data, true, true);
            this.ref.markForCheck();
        });
    }

    lockPolling() {
        if (this.pagepoll) {
            this.pagepoll.unsubscribe();
        }
    }


    updatePolling() {
        this.saveCustomView();
        if (this.sortConfig.refresh) {
            this.startPolling();
        } else {
            this.pagepoll.unsubscribe();
        }
    }

    loadCustomView() {
        const settings = localStorage.getItem('settings');
        if (settings) {
            const jset = JSON.parse(settings);
            if (Object.keys(this.sortConfig).length === Object.keys(jset).length) {
                Object.assign(this.sortConfig, jset);
            } else {
                Object.assign(this.sortConfig, jset)
                this.saveCustomView();
            }
        }
    }

    saveCustomView() {
        localStorage.setItem('settings', JSON.stringify(this.sortConfig));
    }

    indexData(data: campaignData[], sort = false, detectChange = false) {
        data.forEach(elm => {
            // const mana = (Object.keys(elm.production).length === 0) ? 0 : elm.production.manager;
            const hide = (Object.keys(elm.production).length === 0) ? 0 : elm.production.hidden;
            const _notes = elm.production.notes;
            const idx = elm.campaign_id;
            // identify old campaigns to let people know they are old and need to clean
            if (hide && this.findOldDates(elm.start_date)) {
                this.oldCampaignsList.push(elm.server_name)
            }
            if (detectChange) {
                if (elm.rev_status.global_status !== this.changeTracking[idx]['prev_status']) {
                    this._notify.addNotification({ notifier: 'change-status' + idx, title: 'Preview Status', message: elm.server_name + ' - <strong>' + elm.rev_status.global_status.toUpperCase() + '</strong>' });
                    this.changeTracking[idx]['prev_status'] = elm.rev_status.global_status;
                }
            } else {
                this.changeTracking[idx] = { prev_status: elm.rev_status.global_status };
            }
            if (elm.ae_name && this.aeList.indexOf(elm.ae_name) == -1) {
                this.aeList.push(elm.ae_name);
            }

            this.trackData.push({ id: idx, hidden: hide, notes: _notes, data: elm, date: (elm.production.client_due) ? new Date(elm.production.client_due.replace(/-/g, '\/')) : null, server_name: elm.server_name, manager: elm.production.manager, ae_name: elm.ae_name, templates: elm.templates });
        });

        this.aeList.sort()

        if (sort) {
            this.onSortStrings(this.sortConfig.sortBy, this.sortConfig.sortParent, true);
        }
    }

    toggleHidden() {
        this.saveCustomView();
    }

    hideRow(id, value) {
        this.onChangeStatus(id, 'hidden', value)
    }

    onChangeStatus(id, key, val) {
        const itemIndex = this.trackData.findIndex(item => item.id === id);
        const d = { production: {} };
        d.production[key] = val;
        if (key === 'notes') {
            if (this.trackData[itemIndex].data.production.notes === val) { return null };
            if (!val && !this.trackData[itemIndex].data.production.notes) { return null };
        }

        if (key === 'hidden') {
            const set = (val === 0) ? 1 : 0;
            this.trackData[itemIndex].hidden = set;
            d.production[key] = set;
        }

        if (key === 'project_status') {
            if (val === 'ARCHIVE') {
                d['archived'] = 1;
            } else {
                // let nDate = this.handleDateUpdate(key, val);
                // data.production['client_due'] = nDate;
                // item.data.production.client_due = nDate;
            }
        }

        if (key === 'designer') {
            console.log('will change designer');
        }
        this.updateItemAPI(id, d, itemIndex);
    }

    handleDateUpdate(key, value): string {
        if (this._lists.PROD_STATUS.findIndex(elm => elm.status === value) !== -1) {
            // production status request
            const idx = this._lists.PROD_STATUS.findIndex(elm => elm.status === value);
            const today = this.addDays(new Date(), this._lists.PROD_STATUS[idx].days);
            return this.stringDate(today);
        } else {
            const idx = this._lists.INTERNAL_STATUS.findIndex(elm => elm.status === value);
            const today = this.addDays(new Date(), this._lists.INTERNAL_STATUS[idx].days);
            return this.stringDate(today);
        }

    }

    findOldDates(dt: string) {
        const today = new Date();
        const camp = new Date(dt.replace(/-/g, '\/'));
        const elapsed = Math.round(Math.abs((today.getTime() - camp.getTime()) / (24 * 60 * 60 * 1000)));
        if ((elapsed / 30) > this.oldCampaigns) {
            return true;
        } else {
            return false;
        }
    }

    stringDate(today: Date): string {
        const y = today.getFullYear();
        const m = today.getMonth() + 1;
        const d = today.getDate();
        return y + '-' + m + '-' + d;
    }

    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    addRemoveDays(date: Date, days: number, add = true) {
        const result = new Date(date);
        if (add) {
            result.setDate(result.getDate() + days);
        } else {
            result.setDate(result.getDate() - days);
        }

        return result;
    }

    updateItemAPI(id, data: campaignData, idx) {
        this.api.updateData('sapi/manage/campaign/' + id + '/item', data)
            .subscribe((response) => {
                const hide = response.updated.production.hidden;
                const newData = { id: id, hidden: hide, data: response.updated }
                this.trackData[idx].data = response.updated;

                if (data.production.hasOwnProperty('project_status')) {
                    this.onSortStrings(this.sortConfig.sortBy, this.sortConfig.sortParent, true);
                }

                this.ref.markForCheck();
                this.startPolling();
            });
    }

    filterCampaigns(term: string) {
        console.log(term)
        //   this.fullTrackData = JSON.parse(JSON.stringify(this.trackData));

        //   console.log(this.fullTrackData)

        // this.trackData = this.fullTrackData.filter(camp => camp.data.campaign_name.includes(term));

    }

    onSortStrings(key = 'campaign_name', parent = '', init = false) {
        let dir = (this.sortConfig.sortDir !== 0) ? +this.sortConfig.sortDir : 1;

        if (key === this.sortConfig.sortBy && !init) {
            dir = dir * -1;
        }

        const tmpProj = this.trackData;
        const mapped = tmpProj.map((el, i) => {
            if (parent) {
                return (Object.keys(el.data[parent]).length !== 0 && el.data[parent][key]) ? { index: i, value: el.data[parent][key].toLowerCase(), date: el.date } : { index: i, value: '0', date: '0' };
            } else {
                return { index: i, value: el.data[key].toLowerCase(), date: null };
            }

        })

        // console.log(mapped);

        mapped.sort(function(a, b) {
            let val;
            if (dir > 0) {
                val = +(a.value > b.value) || +(a.value === b.value) - 1;
            } else {
                val = +(a.value < b.value) || +(a.value === b.value) - 1;
            }

            if (parent && key === 'project_status') {
                if (val === 0) {
                    let d;
                    if (dir > 0) {
                        d = +(a.date > b.date) || +(a.date === b.date) - 1;
                    } else {
                        d = +(a.date < b.date) || +(a.date === b.date) - 1;
                    }
                    return d;
                }
            }

            return val;
        });

        const result = mapped.map(function(el) {
            return tmpProj[el.index];
        });
        this.sortConfig.sortBy = key;
        this.sortConfig.sortParent = parent;
        this.sortConfig.sortDir = dir;
        this.saveCustomView();

        this.trackData = result;
    }

    activeSort(field: string) {
        if (this.sortConfig.sortBy === field) {
            return { 'btn-default': false, 'btn-info': true }
        } else {
            return { 'btn-default': true, 'btn-info': false };
        }
    }

    getSortClass(field: string) {
        if (this.sortConfig.sortBy !== field) {
            return null;
        } else {
            return (field === this.sortConfig.sortBy && this.sortConfig.sortDir > 0) ? { 'glyphicon-sort-by-alphabet': true } : { 'glyphicon-sort-by-alphabet-alt': true };
        }
    }

    selectRev(id, req) {
        const navigationExtras: NavigationExtras = {
            queryParams: { 'rev': req }
        };
        this.router.navigate(['dashboard/production/campaign/', id], navigationExtras);
    }

    validDate(dtString: string) {
        if (dtString) {
            const arr: string[] = dtString.split('-');
            const dataObj = {
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


    dateChanged(id, event) {
        this.onChangeStatus(id, 'internal_due', event);
    }

    onNotesBlur(id, event) {
        this.onChangeStatus(id, 'notes', event.target.value);
    }

    onChangeManager() {
        if (this.sortConfig.manager !== 'all') {
            this.ae_filter = 'all';
        }
        this.saveCustomView();
    }


    onAEchange() {
        if (this.ae_filter.toLowerCase() != 'all') {
            this.sortConfig.manager = 'all'
        }
    }

    colorDateClass(d, p) {
        if ((p === 'IN PROGRESS' || p === 'REQ SETUP' || p === 'NEW') && d) {
            const plusOne = this.addRemoveDays(this.todayIs, 1, true)
            const plusThree = this.addRemoveDays(this.todayIs, 3, true)

            if (p === 'NEW') {
                const minusOne = this.addRemoveDays(this.todayIs, 1, false)
                const minusTwo = this.addRemoveDays(this.todayIs, 2, false)
                // const minusThree = this.addRemoveDays(this.todayIs, 2, false)

                if (d.getTime() === this.todayIs.getTime()) {
                    return 'due-yellow';
                } else if (d.getTime() === minusOne.getTime()) {
                    return 'due-orange';
                } else if (d.getTime() <= minusTwo.getTime()) {
                    return 'due-red';
                } else if (d.getTime() >= this.todayIs.getTime()) {
                    return '';
                }

            } else {
                if (d.getTime() <= this.todayIs.getTime()) {
                    return 'danger due_today';
                } else if (d <= plusOne) {
                    return 'danger';
                }
                else if (d < plusThree) {
                    return 'warning';
                }
            }

        }
        return '';


    }

}
