import { Component, OnInit, AfterViewInit, AfterViewChecked, OnChanges, Input, Output, ViewChildren, QueryList, EventEmitter, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { CreativeFormControllerComponent } from '../creative-form-controller/creative-form-controller.component';
// import { DuplicateCreativesService } from '../duplicate-creatives.service';
import { AddCreativeTrackService } from '../add-creative-track.service';
import { IcreativeByType, IcreativeTypeDetail } from '../../_interfaces/campaign_edit.interface';
import { IcustomNameValidation } from '../creative-form-controller/creative-form-controller.component';


import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';


export interface IcreativeSize {
    [key: string]: number[];
}

export interface IcreativeList {
    RichMedia?: IcreativeSize;
    Standard?: IcreativeSize;
    Email?: IcreativeSize;
    Static?: IcreativeSize;
}

@Component({
    selector: 'app-creative-array',
    templateUrl: './creative-array.component.html',
    styleUrls: ['./creative-array.component.scss']
})
export class CreativeArrayComponent implements OnInit, AfterViewInit, OnChanges, AfterViewChecked {

    @Input() prefix;
    @Input() showDuplicate = false;
    @Output() currentCreative: EventEmitter<any> = new EventEmitter<any>();
    @Input() creativesFormArray: FormArray;
    @Input() passCreatives: IcreativeByType[] = [];
    @ViewChildren(CreativeFormControllerComponent) allCRVs: QueryList<CreativeFormControllerComponent>;

    creativeManage: IcreativeList;
    blockMultiple = 0;
    blockCount = 0;
    activeDelAll = false;


    constructor(private addCrvSer: AddCreativeTrackService) { }

    ngOnInit() {
        // this.addMore = (this.passCreatives.length > 0) ? true : false;
       
        this.addCrvSer.clearList();
        this.addCrvSer.pushPrevieousCreatives(this.passCreatives);
    }

   ngOnChanges(changes: SimpleChanges) {
       
       if (changes['passCreatives'] && changes.passCreatives.previousValue) {
           console.log('changes in creative array');
           this.addCrvSer.clearList();
            this.addCrvSer.pushPrevieousCreatives(this.passCreatives);
        }
    }

    ngAfterViewChecked() {
        // console.log('---->>>>> ALL DONE FOR SURE');
        // this.blockMultiple = 0;
        // this.blockCount = 0;
        this.activeDelAll = false;
    }
    ngAfterViewInit() {
        // console.log('---->>>>> AfterView');
        this.allCRVs.changes.subscribe(item => {
         
            if(this.blockMultiple > 0){
                 this.blockCount++;

                if (this.blockCount >= this.blockMultiple) {
                    this.allCRVs.forEach((crvComp, idx) => {
                        crvComp.applyDinamic();
                        if( crvComp.typeController.value && crvComp.stdSizes.value ){
                            this.addToService(crvComp, false);
                        }
                    });
                    // console.log('WANT TO RUN ONLY ONCE')
                    this.addCrvSer.runFindDups();
                }
               

                
            } else {
                if(!this.activeDelAll){
                    // console.log('afterView - single add')
                    const crvCompo = this.allCRVs.last;
                    crvCompo.activateSubs();
                } 
            }

            // console.log('end ngafterview')

            // if (this.singleAdd) {
            //     console.log('afterView - single add')
            // } else {

            //     // console.log('afterView - multi add')
                
            // }
        });


    }

    lastCreative(crv) {
        this.currentCreative.emit(crv);
    }

    addItem(data?, single = true) {
        // if(data){
        //     console.warn(data);
        // } else {
        //     console.warn('no data')
        // }
        // this.singleAdd = single;
        // const next = this.allCRVs.length + 1;
        const crvComp = (data) ? CreativeFormControllerComponent.buildCreative(data) : CreativeFormControllerComponent.buildCreative();
        this.creativesFormArray.push(crvComp);
    }

    removeItem(index) {
        const elm = this.allCRVs.find(item => item.index === index);
        this.creativesFormArray.removeAt(index);
        this.addCrvSer.removeCreative(elm.id);
    }

    removeAll() {
        this.activeDelAll = true;
        for (let i = this.creativesFormArray.length - 1; i >= 0; --i) {
            this.removeItem(i);
        }
        this.addCrvSer.clearList();
    }

    // removeAll() {
    //     this.creativesFormArray = new FormArray([]);
    //     this.addCrvSer.clearList();
    // }

    duplicateCreative(index) {
        // this.singleAdd = true;
        const newCrv = CreativeFormControllerComponent.buildCreative();
        newCrv.setValue(this.creativesFormArray.at(index).value);
        this.creativesFormArray.insert(index + 1, newCrv);

        setTimeout(() => {
               const comp = this.allCRVs.find(item => item.index === index + 1);
               comp.applyDinamic();
               console.log('adding by duplicate creative')
                this.addToService(comp);
           }, 0);
    }

    addToService(crv, runDups = true) {
        // console.log(crv)
        // if( this.blockMultiple == 0){
            // if(!runDups){
            //     console.log('SKIPPING RUNNING DUPS AFTER AD')
            // }
            // console.log(crv);
            const addCrv = {};
            addCrv['type'] = crv.typeController.value;
            addCrv['size'] = (crv.stdSizes.value !== 'custom') ? crv.stdSizes.value : crv.customSize.value;
            addCrv['name'] = crv.versionNameController.value;

            if (addCrv['type'] === 'RichMedia') {
                addCrv['size'] = (crv.videoOption.value) ? addCrv['size'] + '_vid' : addCrv['size'];
                addCrv['size'] = (crv.expandOption.value) ? addCrv['size'] + '_exp' : addCrv['size'];
            }

            this.addCrvSer.addCreative(crv.id, addCrv, runDups);
         
        // }
        
    }
}
