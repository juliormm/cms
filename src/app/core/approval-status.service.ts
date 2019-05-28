import { Injectable } from '@angular/core';
import { revisionCreativeData, revisionGroupCreativeData, creativeData, revisionData } from '../_interfaces/campaign.interface';

@Injectable()
export class ApprovalStatusService {
    // set values to what database will use
    public PENDING = 'pending';
    public CHANGES = 'changes';
    public APPROVED = 'approved';
    public INITIATED = 'initiated';
    public STATUS_LIST: string[] = [this.PENDING, this.CHANGES, this.APPROVED, this.INITIATED];

    constructor() { }

    getColorClass(status: string) {
        const c = {};
        const s = status.toLowerCase();
        if (s === this.CHANGES) {
            c['bg-changes'] = true;
        } else if (s === this.APPROVED) {
            c['bg-approved'] = true;
        } else if (s === this.INITIATED) {
            c['bg-info'] = true;
        }

        return c
    }


    getBtnStatus(status: string) {
        const c = {};
        const s = status.toLowerCase();
        if (s === this.CHANGES) {
            c['btn-danger'] = true;
        } else if (s === this.APPROVED) {
            c['btn-success'] = true;
        } else if (s === this.INITIATED) {
            c['bg-info'] = true;
        }

        return c
    }

    creativeNameDisplay(crv: revisionCreativeData) {
        // if (crv.custom_name) {
        //     return crv.custom_name;
        // }

        if ( !crv.name ) {
           return '( ' + crv.dynamic_name + ' )';
        }

        return crv.name;
    }

}
