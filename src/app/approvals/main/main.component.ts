import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params, NavigationExtras } from '@angular/router';
import { ApiService, ApprovalStatusService } from '../../core/index-service';
import { AlertService, IAlerts } from '../../core/alert.service';
import { ApprovalSharedService } from '../approval-shared.service';
import { Subscription } from 'rxjs/Subscription';
import { IPreviewItem, IPreviewData, IPreviewObjects } from '../approval.interface';



@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  private _crvParamObs: Subscription;
  private _init: boolean; // data recived

  displayModal: boolean;
  mobileMenuOpen: boolean;

  campaignData: IPreviewData;
  activeCreative: IPreviewItem;

  navItems: IPreviewObjects[];



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    public _shared: ApprovalSharedService,
    private _alert: AlertService
  ) {
    this._init = false;
    this.mobileMenuOpen = false;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler($event: any) {
    const message = 'Some creatives are still pending!';
    if (this._shared.showSubmit || this._shared.locked || !this._shared.valid) {
      return null;
    } else {
      if (!this.displayModal) {
        const a: IAlerts = { msg: message, timeout: '5000' }
        this._alert.error(a);
      }
      $event.returnValue = message;
      return message;
    }
  }

  // INI
  ngOnInit() {
    this.route.data
      .subscribe((data) => {
        if ('previews' in data['apiStuff']) {
          this._shared.saveFullSync(data['apiStuff']);
          this._shared.valid = true;
          this.navItems = data['apiStuff'].previews;
          this._init = true;
        } else {
          this._shared.valid = false;
        }
      });

    this.route.url.subscribe(urlpath => {
      if (this._shared.locked) {
        if (!this.router.routerState.snapshot.url.split('?prv=')[1]) {
          this.navigateToNew(this._shared.idList[0])
        }
      }
    })

    this._crvParamObs = this.route.queryParams
      .subscribe((qparam: any) => {
        if (this._init && qparam['prv']) {
          this._shared.setSelected(+qparam['prv']);
        }
      })

    this._shared.obsSelected$.subscribe((data: IPreviewItem) => {
      this.activeCreative = data;
    });

    this._shared.obsAllReviced$.subscribe(data => {
      if (!this._shared.locked) {
        if (data['complete']) {
          this.displayModal = true;
        } else {
          this.displayModal = false;
        }
      }
    })
  }


  ngOnDestroy() {
    this._crvParamObs.unsubscribe();
  }

  modalResponse(event) {
    if (event.answer === 'yes') {
      this._shared.updateBaseInfo({ submitted: 1 });
    } else {
      this._shared.showSubmit = true;
    }
  }

  // NAVIGATION
  onToggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  onChangeCreative(req: number) {
    this.mobileMenuOpen = false;
    if (!this._shared.notesActive) {
      if (req !== this.activeCreative.prv_crv_id) {
        this.navigateToNew(req);
      }
    }
  }

  navigateToNew(req: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'prv': req }
    };
    this.router.navigate(['approvals', this._shared.dData.campaign_id, this._shared.dData.rev], navigationExtras);
  }

  onArrowClick(int: number) {
    this.onChangeCreative(int);
  }

}
