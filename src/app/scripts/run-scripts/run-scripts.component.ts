import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../core/api.service';

// import { campaignData, creativeData, revisionData, revisionGroupCreativeData, IScripts } from '../../_interfaces/campaign.interface';



@Component({
    selector: 'app-run-scripts',
    templateUrl: './run-scripts.component.html',
    styleUrls: ['./run-scripts.component.scss']
})
export class RunScriptsComponent implements OnInit {

    @Input() campaign;

    runningPreview = false;
    runnigPreviewName: string;
    completePreview = false;
    validClientPreview = false;

    withContractor = false;
    runningContractor = false;
    contractorInstruction: string;


    constructor() { }

    ngOnInit() {
        this.setup();
    }

    setup() {

        // Notification.requestPermission().then(function(result) {
        //   if (result === 'denied') {
        //     console.log('Permission wasn\'t granted. Allow a retry.');
        //     return;
        //   }
        //   if (result === 'default') {
        //     console.log('The permission request was dismissed.');
        //     return;
        //   }
        //   // Do something with the granted permission.
        // });

        // console.log(this.campaign.scripts)

        const s = this.campaign.scripts.length;

        if (s === 0) {
            // all available
        } else {
            this.campaign.scripts.forEach(elm => {
                if (elm.request === 'client' || elm.request === 'test') {
                    if (elm.completed === 1) {
                        // http to remove completed
                        this.runningPreview = false;
                        this.runnigPreviewName = null;
                        this.completePreview = true;
                    } else {
                        this.runningPreview = true;
                        this.runnigPreviewName = elm.request;
                        this.completePreview = false;
                    }

                } else if (elm.request === 'send' || elm.request === 'synch') {
                    this.runningContractor = true;
                    this.contractorInstruction = elm.request;
                }
            });

        }
        this.validClientPreview = this.validatePreview();
        this.withContractor = (this.campaign.contractor === 1) ? true : false;
    }

    validatePreview() {
        const len = this.campaign.revisions.length;
        if (len > 0) {
            return (this.campaign.revisions[len - 1].submitted === 0) ? true : false;
        } else {
            return false;
        }

    }

    runContractor(to: string) {
        this.runningContractor = true;
        this.contractorInstruction = to;

        setTimeout(() => {
            // this.runningPreview = false;
            // this.completePreview = true;
            this.runTempMessage('contractor');
        }, 3000);
    }

    runPreview(type: string) {
        this.runningPreview = true;
        this.runnigPreviewName = type
        setTimeout(() => {
            this.runningPreview = false;
            this.completePreview = true;
            this.runTempMessage('preview');
        }, 3000);
    }

    runTempMessage(type: string) {
        // possible use alert
        this.contractorInstruction = null;
        this.runnigPreviewName = null;
        setTimeout(() => {
            if ('preview') {
                this.completePreview = false;
            }
        }, 3000);
    }

    // runClientPreview() {
    //     this.runningPreview = true;
    //     setTimeout(() => {
    //         this.runningPreview = false;
    //         this.completePreview = true;
    //         this.runTempMessage('preview');
    //     }, 3000);
    // }
}
