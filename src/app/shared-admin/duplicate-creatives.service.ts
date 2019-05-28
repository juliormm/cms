import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { IcustomNameValidation } from './creative-form-controller/creative-form-controller.component';

@Injectable()
export class DuplicateCreativesService {

    private duplicatesSubject = new Subject();
    private autoAddName = new Subject();

    duplicates$ = this.duplicatesSubject.asObservable();
    autoAddName$ = this.autoAddName.asObservable();

    conflictIndex: number[] = [];
    crvNames = {};

    constructor() { }

    announceDuplicates(dups: number[]) {
        this.conflictIndex = this.conflictIndex.concat(dups);
        this.duplicatesSubject.next(dups);
    }

    resetNewNames(nameArr: any) {
        this.crvNames = nameArr;
    }

    validateCustomName(dataObj: IcustomNameValidation) {
        let valid;
        const dKeys = Object.keys(this.crvNames);
        if (dKeys.length !== 0) {
            valid = dKeys.every(key => {
                if (+key !== dataObj.index && this.crvNames[key].type === dataObj.type && this.crvNames[key].value === dataObj.value && this.crvNames[key].options.video === dataObj.options.video) {
                    return (dataObj.size !== null && this.crvNames[key].size !== dataObj.size);
                } else {
                    return true;
                }
            });
        } else {
            valid = true;
        }

        this.crvNames[dataObj.index] = dataObj;
        return [valid];
    }
}
