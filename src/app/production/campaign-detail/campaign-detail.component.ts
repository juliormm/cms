import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { FormGroup, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

import { ApiService } from '../../core/api.service';
import { ApprovalStatusService } from '../../core/approval-status.service';
import { ProductionSharedService } from '../production-shared.service';
import { ProductionListService } from '../../shared-admin/production-list.service';

import { ProductionFormComponent } from '../../shared-admin/production-form/production-form.component';
import { CreativeArrayComponent } from '../../shared-admin/creative-array/creative-array.component';
import { campaignData, creativeData, revisionData, revisionGroupCreativeData } from '../../_interfaces/campaign.interface';
import { AuthenticationService } from '../../core/authentication.service';
import { QueueDataService } from '../../core/queue-data.service';

import { environment } from '../../../environments/environment';

import * as moment from 'moment';


@Component({
    selector: 'app-campaign-detail',
    templateUrl: './campaign-detail.component.html',
    styleUrls: ['./campaign-detail.component.scss']
})
export class CampaignDetailComponent implements OnInit {
    prevList: any[] = [];
    statusList: string[];
    prodControl: FormGroup;
    showRevision = true;
    activeRevision: revisionData;
    showCreative: revisionGroupCreativeData;
    typeHeadingClass = 'panel-info';
    globalCreativeExpand = false;
    creativeForm: FormGroup;
    creativesArray: FormArray;
    creativeDetail: creativeData;
    previewAssets: string;

    showPage = false;
    campaignID: number;
    userInfo: any;
    utcTimePre;
    utcTimeTraf;
    lockPrevBtn = false;
    lockPubBtn = false;
    lockQABtn = false;
    revDetailCollapsed = false;

    previewAppURL = environment.PREVIEW_APP;
    expandTag = false;
    @ViewChild('arrayList') public arrayList: CreativeArrayComponent;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public _shared: ProductionSharedService,
        public _lists: ProductionListService,
        public _shareStatus: ApprovalStatusService,
        private api: ApiService,
        public pageScrollService: PageScrollService,
        private auth: AuthenticationService,
        private queueService: QueueDataService,
        @Inject(DOCUMENT) private document: any
    ) { }

    ngOnInit() {

        this.userInfo = this.auth.getUser();
        this.statusList = this._shareStatus.STATUS_LIST;
        this.route.params.subscribe(params => {
            this.campaignID = +params['id']; // (+) converts string 'id' to a number
        });

        this.route.data
            .subscribe((data) => {
                const justData: campaignData = data['campDetail'];

                if ('failed' in justData) {
                    console.warn('no data found')
                } else {
                    // this.utcTimePre = moment(new Date()).utc();
                    this._shared.setNewData(justData);
                    this.prodControl = ProductionFormComponent.buildGroup(justData.production, !!justData.archived);
                    this.allGood();
                    this.showPage = true;
                    this.utcTimePre = this.validateTime(this._shared.data.scripts.previews.preview_time)
                    if (this._shared.data.scripts.previews.preview_req == 1 && this.utcTimePre > 5) {
                        this._shared.data.scripts.previews.preview_req = 0;
                        this._shared.data.scripts.previews.preview_error = 1;
                        // this.lockPrevBtn = false;
                    }
                    this.utcTimeTraf = this.validateTime(this._shared.data.scripts.publish.publish_time)
                    if (this._shared.data.scripts.publish.publish_req && this.utcTimeTraf > 5) {
                        this._shared.data.scripts.publish.publish_req = 0;
                        this._shared.data.scripts.publish.publish_error = 1;
                        // this.lockPubBtn = false;
                    }

                    this.lockPrevBtn = this._shared.disablePreview();
                    this.lockPubBtn = this._shared.disablePublish();

                }

            });


    }

    allGood() {
        this._shared.obsFullData$
            .subscribe((data: campaignData) => {
                this.prevList = data.revisions;
            });

        this._shared.obsRevision$
            .subscribe((data: revisionData) => {
                this.activeRevision = data;
                this.previewAssets = (this.activeRevision.server === 'PREVIEWS') ? environment.ASSETS_PREVIEW_URL : environment.ASSETS_QT_URL;
                // console.log(this.previewAssets)
                this.gotoRevisions();
                this.lockPrevBtn = this._shared.disablePreview();
                this.lockPubBtn = this._shared.disablePublish();
            });

        this.route.queryParams
            .subscribe((qparam: any) => {
                if (Object.keys(qparam).length > 0) {
                    if(this._shared.data.revisions.length >= +qparam['rev']){
                        this._shared.setRevision(qparam['rev']);
                    } else {
                        this.router.navigate([], {queryParams: {}});
                    }
                    
                }
            })

        this._shared.obsScripts$
            .subscribe(data => {
                this.lockPrevBtn = this._shared.disablePreview();
                this.lockPubBtn = this._shared.disablePublish();
            });

        this.creativesForm();
    }

    // setClassStatus(statList: string) {
    //     return this._shareStatus.getColorClass(statList);
    // }

    /*
        PREVIEWS
     */

    refreshPreviews(event) {
        // console.log(event)
        this._shared.updateGlovalStatus(event.id);
    }

    navigateToPreviews(rev) {
        window.open(this.previewAppURL + 'approvals/' + this._shared.data.campaign_id + '/' + rev, '_blank');
    }

    gotoRevisions() {
        if(this.revDetailCollapsed){
            const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#revision-panel');
            this.pageScrollService.start(pageScrollInstance);
        }

    }

    showPreview(crv: revisionGroupCreativeData) {
        this.showCreative = crv;
    }

    changeReset(event, id) {
        const val = (event) ? 1 : 0;
        const data = { submitted: val };
        this.api.updateData('api/previews/rev/' + id, data).subscribe(response => {
                // console.log(response); 
                this.lockPrevBtn = this._shared.disablePreview();
                this.lockPubBtn = this._shared.disablePublish();
           }, err => { console.log(err); });
    }

    removePreview() {
        this.showCreative = null;
    }

    changeRevision(id) {
        this.removePreview();
        const navigationExtras: NavigationExtras = {
            queryParams: { 'rev': id }
        };
        this.router.navigate([], navigationExtras);
    }

    /*
        PRODUCTION
    */

    updateProduction(data) {
        const changes = data
        this.api.updateData('sapi/manage/campaign/' + this._shared.data.campaign_id, changes, true)
            .subscribe(resp => {
                this.queueService.retrieveQueueData();
            });
    }

    handleNotesEvent(event){
         if(event.value != this._shared.data.production.notes){
             this._shared.data.production.notes = event.value;
             this.productionEvent(event);
        }
    }

    productionEvent(event) {
          if (event.valid) {
            const setData = { production: {} }
            setData.production[event.name] = event.value;
            if (event.value === 'ARCHIVE') {
                setData['archived'] = 1;
            }

            this.updateProduction(setData);
        }

    }

    /*
        CREATIVE DETAIL SECTION
    */


    loadCreativeDetail(crv: creativeData) {
        this.creativeDetail = crv;
    }

    updateCreative(crv: creativeData) {
        this._shared.updateCreative(crv);
    }
    creativesForm() {
        this.creativeForm = new FormGroup({
            creatives: new FormArray([])
        });
        this.creativesArray = this.creativeForm.get('creatives') as FormArray;
    }

    submitValidate() {
        if (!this.creativeForm.valid) { return true; }
        if (this.creativesArray.length === 0) { return true; }

        return false;
    }

    onSubmitCreatives() {
        const store = Object.assign({}, this.creativeForm.value);
        store['server_name'] = this._shared.data.server_name;
        this.api.updateData('sapi/manage/campaign/' + this._shared.data.campaign_id + '/creatives', store)
            .subscribe((data) => {
                this._shared.updateCreatives(data)
                this.arrayList.removeAll();
                this.creativeForm.reset();
            });
    }

    requestNewPreview() {
        this.lockPrevBtn = true;
        let ts = new Date().getTime();

        this.api.insertData('sapi/manage/campaign/' + this._shared.data.campaign_id + '/request/preview', { time: ts }, true, true, true)
            .subscribe(data => {
                this._shared.data.scripts = data;
                // this.lockPrevBtn = false;
                this.utcTimePre = this.validateTime(this._shared.data.scripts.previews.preview_time)
            });

    }

    // requestQAPreview(){
    //     this.lockQABtn = true;
    //     let ts = new Date().getTime();
    //      this.api.insertData('sapi/manage/campaign/' + this._shared.data.campaign_id + '/request/qa', { time: ts }, true, true, true)
    //         .subscribe(data => {
    //             this._shared.data.scripts = data;
    //             // this.lockPrevBtn = false;
    //             this.utcTimePre = this.validateTime(this._shared.data.scripts.previews.qa_link)
    //         });
    // }

    requestPublish() {
        this.lockPubBtn = true;
        let ts = new Date().getTime();
        this.api.insertData('sapi/manage/campaign/' + this._shared.data.campaign_id + '/request/publish', { time: ts }, true, true, true)
            .subscribe(data => {
                this._shared.data.scripts = data;
                // this.lockPubBtn = false;
                this.utcTimeTraf = this.validateTime(this._shared.data.scripts.publish.publish_time)
            });

    }

    validateTime(d) {
         if(+d == 0){
             return 0;
         }
        let mD = moment(new Date(d));
        let dif = moment(new Date().getTime()).diff(mD, 'minutes');
        return dif
    }

    getCDN(crv){
        if(crv.cdn == 'HYFN'){
            return environment.HYFN_CDN;
        } else {
            return environment.QT_CDN;
        }
    }

    peopleIsValid(data){

        return !Array.isArray(data)
        // return true;
    }
}
