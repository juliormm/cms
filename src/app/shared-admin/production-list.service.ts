import { Injectable } from '@angular/core';

@Injectable()
export class ProductionListService {

    PROD_STATUS: any[] = [
        // { status: 'REQ SETUP', days: 0, class: 'bg-orange assigned' },
        // { status: 'NEW', days: 0, class: 'bg-silver assigned' },
        // { status: 'ON HOLD', days: 0, class: 'bg-red assigned' },
        { status: 'NEW', days: 5, class: 'bg-yellow assigned' },
        { status: 'IN PROGRESS', days: 5, class: 'bg-blue assigned' },
        { status: 'WITH CLIENT', days: 0, class: 'bg-green assigned' },
        { status: 'REVISIONS', days: 5, class: 'bg-aqua assigned' },
        { status: 'PUBLISHED', days: 0, class: 'bg-gray assigned' },
        { status: 'ON HOLD W/ CLIENT', days: 0, class: 'bg-olive assigned' },
        { status: 'CANCELLED', days: 0, class: 'bg-maroon assigned' },
        { status: 'QA', days: 5, class: 'bg-purple assigned' },
        { status: 'QA-Changes', days: 5, class: 'bg-red assigned' },
        { status: 'QA-Approved', days: 5, class: 'bg-lime assigned' }

        // { status: 'ARCHIVE', days: 0, class: 'bg-maroon assigned' }
    ];


    INTERNAL_STATUS: any[] = [
        // { status: 'Creative Direction', days: 1, class: 'bg-silver assigned' },
        { status: 'In production', days: 5, class: 'bg-lime assigned' },
        { status: 'Revisions', days: 2, class: 'bg-aqua assigned' },
        { status: 'Publishing', days: 1, class: 'bg-olive assigned' }
    ];

    DESINGERS: any[] = [
        { name: 'Cristian', class: 'bg-yellow assigned' },
        { name: 'Jacob', class: 'bg-yellow assigned' },
        { name: 'Rachel', class: 'bg-yellow assigned' },
        { name: 'Rey', class: 'bg-yellow assigned' },
    ];

    THEOREM_TEAM: any[] = [
        { name: 'Jair', class: 'bg-yellow assigned' }, 
        { name: 'Luis', class: 'bg-yellow assigned' },
        { name: 'Lorena', class: 'bg-yellow assigned' },
        { name: 'Vicente', class: 'bg-yellow assigned' },
        { name: 'Designer 1', class: 'bg-yellow assigned' }, // for future designers, can rename later. 
        { name: 'Designer 2', class: 'bg-yellow assigned' }, // for future designers, can rename later. 
        { name: 'QA', class: 'bg-yellow assigned' }
    ];

    MANAGERS: any[] = [
        { name: 'Jacob', log: 'jacob', class: 'bg-yellow assigned' },
        { name: 'Rachel', log: 'rachel', class: 'bg-yellow assigned' },
        { name: 'Rey', log: 'rey', class: 'bg-yellow assigned' },
        { name: 'Robyn', log: 'robyn', class: 'bg-yellow assigned' },
    ];

    getStatusClass(status: string, arr: any[]): string {
        const item = arr.find(elm => {
            return (elm.status === status);
        })
        return (item) ? item.class : '';
    }

    getDesignerClass(name: string): string {

        const item = this.PROD_STATUS.find(elm => {
            return (elm.name === name);
        })
        console.log(item.class)
        return (item) ? item.class : '';
    }

}
