import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

import { AuthenticationService } from '../../core/authentication.service';
import { ApprovalStatusService } from '../../core/approval-status.service'
import { DynamicModalService, ModalPassData } from '../../core/dynamic-modal.service';
import { ManageCampaignService } from '../manage-campaign.service';

import { ICampaignData, IPreviewData, IPreviewCreatives, ICreativeItem, IShowCase } from '../../shared-admin/campaign-data.service';

import { ProductionListService } from '../../shared-admin/production-list.service';
// import { FormAmListService } from '../../shared-admin/form-am-list.service';
import { FormAmListComponent } from '../../shared-admin/form-am-list/form-am-list.component';
import { FormClientComponent } from '../../shared-admin/form-client/form-client.component';
// import { ProductionFormComponent } from '../../shared-admin/production-form/production-form.component';
import { ModalYesNoComponent, ModalYesNoData } from '../../shared/modal-yes-no/modal-yes-no.component';

import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { environment } from '../../../environments/environment';


@Component({
    selector: 'app-campaign-edit',
    templateUrl: './campaign-edit.component.html',
    // providers: [KeysPipe],
    styleUrls: ['./campaign-edit.component.scss']
})
export class CampaignEditComponent implements OnInit {

    resetForm = false;
    archivedMessage = false;
    campaignData: ICampaignData;
    campaignForm: FormGroup;
    prodControl: FormGroup;
    tagsControls: FormArray;
    campaignNameControl: FormControl;
    hiddenControl: FormControl;
    archivedControl: FormControl;
    amGroupControl: FormGroup;
    clientGroupControl: FormGroup;
    // showcaseController: FormControl;
    lastRevision: number;
    lastRevDel = true;
    // lockModalProcess = false;

    collapseBasic = false;
    collapseShowcase = false;
    collapseProd = true;
    collapseTags = true;
    collapseRevs = true;
    collapseCrvs = true;

    amSelectedFull = {}

    showcaseCreatives: IPreviewCreatives[];
    loadingShowCaseImg = false;

    @ViewChild(FormClientComponent) formClient: FormClientComponent;

    activeRevision: any;
    logedUser;
    showcaseCover: string;

    public uploader: FileUploader;

    constructor(
        private _auth: AuthenticationService,
        private _manageSer: ManageCampaignService,
        private api: ApiService,
        private _modalService: DynamicModalService,
        public _status: ApprovalStatusService,
        public _lists: ProductionListService,
        // private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        // private _amList: FormAmListComponent,
        public pageScrollService: PageScrollService,
        @Inject(DOCUMENT) private document: any
    ) {

    }

    ngOnInit() {

        this.logedUser = this._auth.getUser();
        this.route.data.subscribe((data: any) => {
            console.log(data)
            this.campaignData = data['campDetail'];
            this._manageSer.setCampaignData(this.campaignData);
        });

        this._manageSer.$dataChanged
            .subscribe((data: ICampaignData) => {
                this.campaignData = JSON.parse(JSON.stringify(data));
            });

        this.buildForm(this.campaignData);

        // MODAL
        this._modalService.respondModal$.subscribe(
            (mRes: ModalYesNoData) => {
                // console.log(mRes);
                if (mRes.id === 'deleteCreative' && mRes.yes) {
                    const crv: ICreativeItem = mRes.pass;
                    this.api.deleteData('sapi/admin/creative/' + crv.crv_id)
                        .subscribe(() => {
                            console.log('delete creative');
                        });
                } else if (mRes.id === 'deletePreview' && mRes.yes) {

                    if (this.lastRevision) {
                        this.api.deleteData('sapi/manage/revisions/' + this.lastRevision).subscribe(
                            () => {
                                const revLeng = this.campaignData.revisions.length
                                this.campaignData.revisions.splice(revLeng - 1, 1);
                                this.setLastPreview();
                            });

                    }
                }

                this._modalService.hideModal();
            });
        this.setLastPreview();
        this._modalService.hideModal();


        // SHOWCASE setup
        this.uploader = new FileUploader({ url: environment.API_URL + 'sapi/manage/campaign/' + this.campaignData.campaign_id + '/showcase/photo', itemAlias: 'photo', authToken: localStorage.getItem('id_token'), autoUpload: true });
        this.showcaseCreatives = this.getRevisionCreatives(this.campaignData.show_case.revision);
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
            this.loadingShowCaseImg = true;
        };
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            this.loadingShowCaseImg = false;
            const resp = JSON.parse(response);
            this._manageSer.updateShowcase(resp['data']);
        };
        this.showcaseCover = (this.campaignData.show_case.cover) ? environment.SHOWCASE_IMAGES + this.campaignData.show_case.cover : null;

        this._manageSer.$showcaseChanged
            .subscribe((data: IShowCase) => {
                this.campaignData.show_case = data;
                this.showcaseCover = environment.SHOWCASE_IMAGES + data.cover;
            });
    }

    onAmSelected(e){
        this.amSelectedFull = e;
    }

    getRevisionCreatives(rev: number): IPreviewCreatives[] {
        if (rev) {
            const selRev: IPreviewData = this.campaignData.revisions.find(elm => {
                return +elm.revision === +rev;
            });
            return selRev.creatives;
        } else {
            return []
        }
    }

    updateShowcaseCrv(crv_id, value) {
        const set = (value) ? 1 : 0;
        this.api.updateData('sapi/manage/creative/' + crv_id, { portfolio: set }).subscribe();
    }

    saveShowcase(event?) {
        let rev: number = this.campaignData.show_case.revision;
        if (event) {
            this.showcaseCreatives = this.getRevisionCreatives(+event);
            rev = +event;
        }
        const changes = { showcase: this.campaignData.show_case.active, showcase_rev: rev };
        this.api.updateData('sapi/manage/campaign/' + this.campaignData.campaign_id, changes)
            .subscribe();

    }

    getCreativeCount(crvs: IPreviewCreatives[]) {
        const c: any[] = []
        crvs.forEach(elm => {
            const t = {}
            t['key'] = elm.tag;
            t['value'] = elm.items.length;
            c.push(t)
        });
        return c;
    }


    changeReset(event, id) {
        const val = (event) ? 1 : 0;
        const data = { submitted: val };
        this.api.updateData('api/previews/rev/' + id, data)
            .subscribe(response => {
                console.log(response);
            },
            err => {
                console.log(err);
            });
    }

    buildForm(data) {
        
        this.campaignForm = this.fb.group({
            tw_id: this.fb.control({ value: data.tw_id, disabled: true }),
            phnx_id: this.fb.control({ value: data.phnx_id, disabled: true }),
            serverName: this.fb.control({ value: data.server_name, disabled: true }),
            archived: this.fb.control(data.archived),
            campaign_name: this.fb.control(data.campaign_name, [Validators.required, Validators.minLength(3)]),
            client: FormClientComponent.buildGroup(data.client),
            // production: ProductionFormComponent.buildGroup(data.production),
            am: FormAmListComponent.buildGroup(data.am)
            // tags: this.fb.array([
            //     this.fb.control(null)
            // ])
        });
        this.clientGroupControl = this.campaignForm.get('client') as FormGroup;
        this.amGroupControl = this.campaignForm.get('am') as FormGroup;
        // this.showcaseController = this.campaignForm.get('showcase') as FormControl;
        this.archivedControl = this.campaignForm.get('archived') as FormControl;
        this.archivedControl.valueChanges.subscribe((val: number) => {
            if (val !== this.campaignData.archived) {
                this.archivedMessage = true;
                this.archivedControl.markAsDirty();
            } else {
                this.archivedMessage = false;
                this.archivedControl.markAsPristine();
            }
        })

        // this.tagsControls = this.campaignForm.get('tags') as FormArray;
        this.campaignNameControl = this.campaignForm.get('campaign_name') as FormControl;
        // this.prodControl = this.campaignForm.get('production') as FormGroup;
        this.resetForm = false;
    }

    // onAddTags() {
    //     this.tagsControls.push(this.fb.control(null));
    // }

    // onRemoveTags(index) {
    //     this.tagsControls.removeAt(index);
    // }

    getDirtyValues(cg) {
        const dirtyValues = {}; // initialize empty object
        Object.keys(cg.controls).forEach((c) => {
            const currentControl = cg.get(c);
            // console.log(currentControl.dirty)
            if (currentControl.dirty) {
                console.log(currentControl)
                if (currentControl.controls) {
                    dirtyValues[c] = {};
                    const innerValues = {};
                    Object.keys(currentControl.controls).forEach((ic) => {
                        const innerControl = currentControl.get(ic);
                        // console.log(innerControl.dirty)
                        if (innerControl.dirty) {
                            console.log(innerControl)
                            dirtyValues[c][ic] = innerControl.value;
                        }
                    });
                } else {
                    dirtyValues[c] = currentControl.value;
                }
            } else {

            }

        });

        return dirtyValues;
    }

    onSubmit() {
        let changes = this.getDirtyValues(this.campaignForm);
        changes = this.prepareDateDB(changes);
        this.api.updateData('sapi/manage/campaign/' + this.campaignData.campaign_id, changes)
            .subscribe(data => {
                this.campaignData = data.updated;
                console.log(this.campaignData);
                this.onResetForm();
            });
    }



    prepareDateDB(changes) {
        if (changes.hasOwnProperty('production') && ('internal_due' in changes['production'] || 'client_due' in changes['production'])) {
            if (changes['production']['internal_due']) {
                changes['production']['internal_due'] = this.returnDate(changes['production']['internal_due']['date']);
            }
            if (changes['production']['client_due']) {
                changes['production']['client_due'] = this.returnDate(changes['production']['client_due']['date']);
            }
        }

        if(changes.hasOwnProperty('am')){
            changes.am = this.amSelectedFull;
        }

        return changes;
    }

    returnDate(date) {
        return date.year + '-' + date.month + '-' + date.day
    }


    onResetForm() {
        this.formClient.reset(this.campaignData.client);
        this.amGroupControl.reset(this.campaignData.am);
        this.archivedMessage = false;
        this.buildForm(this.campaignData);
    }


    // getCrvSize(arr: any[]) {
    //     const newList = [];
    //     for (const typ of this.campaignData.creatives) {
    //         for (const crv of typ.items) {
    //             if (arr.indexOf(crv.crv_id) !== -1) {
    //                 newList.push(crv);
    //             }
    //         }

    //     }

    //     return newList;

    // }

    // focusRevision(rev) {
    //     this.activeRevision = this.campaignData.revisions.find(item => {
    //         return item.revision === rev;
    //     });
    //     // this.gotoRevisions();
    // }

    duplicateRevision() {
        if (this.lastRevision) {
            this.api.getData('sapi/manage/revisions/' + this.lastRevision + '/duplicate').subscribe(data => {
                this.campaignData.revisions = data;
                this.setLastPreview();
            })
        }
    }

    deleteLastPreview() {
        if (this.lastRevision) {
            this._modalService.showModal({ component: ModalYesNoComponent, title: 'Delete this Preview?', message: 'Are you sure you want to delete this preview?', id: 'deletePreview' });
        }
    }

    setLastPreview() {
        const len = this.campaignData.revisions.length;
        if (len > 0) {
            this.lastRevision = this.campaignData.revisions[len - 1].preview_rev_id;
            this.lastRevDel = (this.campaignData.revisions[len - 1].global_status !== 'pending') ? true : false;
        } else {
            this.lastRevision = null;
        }

        this.activeRevision = null;
    }

    // gotoRevisions() {
    //     const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#revisions-detail');
    //     this.pageScrollService.start(pageScrollInstance);
    // }

    onDeleteCreatve(crv: ICreativeItem) {
        const msg = (crv.no_preview) ? 'Are you sure you want to delete this creative?' : 'CAUTION: The creative is part of a preview, if you delete the creative all reference in the previews will also be deleted'
        const modObj: ModalPassData = { component: ModalYesNoComponent, title: 'Delete Creative?', message: msg, id: 'deleteCreative', pass: crv };
        this._modalService.showModal(modObj);
        // }
    }

    refreshPreviews(data: IPreviewData, updateGlobal = false) {
        if (updateGlobal) {
            this._manageSer.updateSingleRevision(data);
        } else {
            const idx = this._manageSer.getRevisionIndex(data);
            this.campaignData.revisions[idx] = data;
            this.campaignData.revisions[idx].global_status = this._manageSer.getGlobalRevisionStatus(this.campaignData.revisions[idx]);
        }

    }


    revisionIndex(index, item: IPreviewData) {
        return item.revision;
    }

    // fileChanged(e: Event) {
    //   const target: HTMLInputElement = e.target as HTMLInputElement;
    //   for (let i = 0; i < target.files.length; i++) {
    //     // upload(target.files[i]);
    //     console.log(target.files[i]);
    //   }
    // }



}
