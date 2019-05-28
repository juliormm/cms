import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, SimpleChanges, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { IcreativeDetail } from '../share-admin.interface';
import { CreativeTypesService } from '../../shared/creative-types.service';
import { AddCreativeTrackService } from '../add-creative-track.service';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';


export interface IcustomNameValidation {
     index: number;
     value: string;
     type: string;
     size: string;
     options: any;
}

@Component({
     selector: 'creative-control',
     templateUrl: './creative-form-controller.component.html',
     styleUrls: ['./creative-form-controller.component.scss']
})
export class CreativeFormControllerComponent implements OnInit {
     @Input() prefix;
     @Input() index: number;
     @Input() creativeGroup: FormGroup;
     @Input() showDuplicate = false;
     @Output() removed: EventEmitter<number> = new EventEmitter<number>();
     @Output() duplicateEvent: EventEmitter<number> = new EventEmitter<number>();
     @Output() setItem: EventEmitter<any> = new EventEmitter<any>();

     id = new Date().getTime();
     createDynamic = false;

     activeSizes: any[];
     validatedNameValue: string;
     validatedNameLock = false;

     showOptions = false;
     showExpandable = false;
     showCustomSizes = false;
     hideSize = false;
     bgColorClass = '';
     typeController: FormControl;
     sizeGroupController: FormGroup;
     customSize: FormControl;
     expandSize: FormControl;
     stdSizes: FormControl;
     expandOption: FormControl;
     groupOptions: FormGroup;
     videoOption: FormControl;
     versionNameController: FormControl;
     showVersionName = false;
     duplicateActive: FormControl;
     versionNamePlaceHolder = '** Requiered **';
     versionNameShowOptional = false;

     private subCustomSize;
     private subTypeController;
     private subVersionNameController;
     private subStdSizes;
     private subExpandOption;
     private subVideoOption;
     private servDupCrv$;
     private servDupNames$;


     static buildCreative(data?: IcreativeDetail) {

          // console.log(data)
          const baseOptions = {
               video: false,
               map: false,
               gallery: false,
               form: false,
               custom: false,
               location: false,
               expandable: false,
               fmcontent: false,
               carousel: false,
               pushdown: false,
               clicktocall: false
          }
          const baseSize = {
               std_size: null,
               custom_size: null,
               expand_size: null
          }
          const set: IcreativeDetail = (data) ? { type: data.type, size: data.size, versionName: data.versionName, options: data.options } : { type: null, size: baseSize, versionName: null, options: baseOptions };
          return new FormGroup({
               type: new FormControl(set.type, Validators.required),
               duplicate: new FormGroup({
                    active: new FormControl(false),
                    times: new FormControl(6)
               }),
               size: new FormGroup({
                    std_size: new FormControl(set.size.std_size),
                    custom_size: new FormControl(set.size.custom_size),
                    expand_size: new FormControl(set.size.expand_size)
               }),
               versionName: new FormControl(set.versionName),
               options: new FormGroup({
                    video: new FormControl(set.options.video),
                    carousel: new FormControl(set.options.carousel),
                    pushdown: new FormControl(set.options.pushdown),
                    gallery: new FormControl(set.options.gallery),
                    location: new FormControl(set.options.location),
                    expandable: new FormControl(set.options.expandable),
                    fmcontent: new FormControl(set.options.fmcontent),
                    map: new FormControl(set.options.map),
                    form: new FormControl(set.options.form),
                    custom: new FormControl(set.options.custom),
                    clicktocall: new FormControl(set.options.clicktocall)
               })
          })
     }

     constructor(public crvTypeSer: CreativeTypesService, private addCrvServ: AddCreativeTrackService) { }

     ngOnDestroy() {
          this.subCustomSize.unsubscribe();
          this.subTypeController.unsubscribe();
          this.subVersionNameController.unsubscribe();
          this.subStdSizes.unsubscribe();
          this.subExpandOption.unsubscribe();
          this.subVideoOption.unsubscribe();
          // this.servDupCrv$.unsubscribe();
          // this.servDupNames$.unsubscribe();
     }

     ngOnInit() {
          // console.log(this.id)
          this.activeSizes = this.crvTypeSer.STD_SIZES;
          this.duplicateActive = this.creativeGroup.get('duplicate').get('active') as FormControl;
          this.groupOptions = this.creativeGroup.get('options') as FormGroup;
          this.typeController = this.creativeGroup.get('type') as FormControl;
          this.sizeGroupController = this.creativeGroup.get('size') as FormGroup;
          this.stdSizes = this.sizeGroupController.get('std_size') as FormControl;
          this.customSize = this.sizeGroupController.get('custom_size') as FormControl;
          this.expandSize = this.sizeGroupController.get('expand_size') as FormControl;
          this.expandOption = this.groupOptions.get('expandable') as FormControl;
          this.versionNameController = this.creativeGroup.get('versionName') as FormControl;
          this.videoOption = this.groupOptions.get('video') as FormControl;

          if (this.versionNameController.value) {
               this.showVersionName = true;
          }

          this.servDupCrv$ = this.addCrvServ.dupCrv$.subscribe((data: number[]) => {
               // this.versionNameShowOptional = false;
               if (data.indexOf(this.id) !== -1) {
                    const validate = (this.stdSizes.value === 'custom') ? false : true;
                    this.setVersionNameRequiered(validate);

               } else {
                    
                    if (!this.versionNameController.value) {
                         this.removeVersionNameRequired();
                         this.showVersionName = false;

                    } else {
                         this.setVersionNameRequiered(false);
                         // this.versionNameShowOptional = true;
                    }

                   
               }
          });

          this.servDupNames$ = this.addCrvServ.dupNames$.subscribe((data: number[]) => {
               if (data.indexOf(this.id) !== -1) {
                    this.versionNameController.setErrors({ 'notUnique': true });
               } else {
                    if (this.versionNameController.hasError('notUnique')) {
                         this.versionNameController.setErrors(null);
                    }
               }
          });
     }

     validateFocus() {
          if(!this.versionNameController.value && this.versionNameController.valid){
               // console.log('not empty keep')
               this.showVersionName = false;
          }
     }

     activateSubs() {
          this.subCustomSize = this.customSize.valueChanges
               .debounceTime(300)
               .subscribe(value => {
                    if (this.customSize.valid && this.customSize.value) {
                         this.sendToParent('custom size bounce');
                    }
               });

          this.subTypeController = this.typeController.valueChanges.subscribe(value => {
               this.clearSizes();
               this.runValidation(value);
               this.setBGcolor(value);

               if (value === 'Email') {
                    this.sendToParent('email type');
               }
          });

          this.subVersionNameController = this.versionNameController.valueChanges
               .debounceTime(400)
               .filter((data) => {
                    return data !== null && this.validatedNameValue !== data
               }).switchMap(data => {
                    if (data) {
                         const passObj: IcustomNameValidation = { index: this.id, value: data, type: this.typeController.value, size: this.stdSizes.value, options: this.groupOptions.value }
                         const val = this.addCrvServ.validateCustomName(passObj);
                    } else {
                         this.versionNameShowOptional = false;
                         // this.showVersionName = false;
                    }

                    return [];
               })
               .subscribe(valid => { });

          this.subStdSizes = this.stdSizes.valueChanges.subscribe(value => {
               if (value === 'custom') {
                    this.showCustomSizes = true;
                    this.setCustomValidation();
                    if (this.showExpandable) {
                         this.setExpandCustomValidation();
                    }
               } else {
                    this.showCustomSizes = false;
                    this.remCustomValidation();
                    if (this.showExpandable) {
                         this.remCustomValidation();
                    }

                    if (value) {
                         this.sendToParent('size');
                    }
               }
          });

          this.subExpandOption = this.expandOption.valueChanges.subscribe(value => {
               this.clearSizes();
               this.handleExpandableOption(value);

          });

          this.subVideoOption = this.videoOption.valueChanges.subscribe(value => {
               const tmpName = this.validatedNameValue;
               this.validatedNameValue = null;
               if (this.stdSizes.value) {
                    this.sendToParent('video');
               }
          });
     }

   

     sendToParent(who = null) {
          this.setItem.emit(this);
     }


     runValidation(value) {
          switch (value) {
               case 'Email':
                    this.handleExpandableOption(false);
                    this.removeAllValidatorSize();
                    this.hideSize = true;
                    this.showOptions = false;
                    break;
               case 'RichMedia':
                    this.hideSize = false;
                    this.showOptions = true;
                    this.setBaseSizeValidation();
                    break;
               case 'Standard':
                    this.handleExpandableOption(false);
                    this.hideSize = false;
                    this.showOptions = true;
                    this.setBaseSizeValidation();
                    break;
               case 'Static':
                    this.handleExpandableOption(false);
                    this.activeSizes = this.crvTypeSer.STAT_SIZES;
                    this.hideSize = false;
                    this.showOptions = false;
                    this.setBaseSizeValidation();
                    break;
               default:
                    console.log('no validation');
                    break;
          }
     }

     handleExpandableOption(value: boolean) {
          if (value) {
               this.activeSizes = this.crvTypeSer.RM_EXP_SIZES;
               this.showExpandable = true;
               if (this.showCustomSizes) {
                    this.setExpandCustomValidation();
               }

          } else {
               this.activeSizes = this.crvTypeSer.STD_SIZES;
               this.showExpandable = false;
               this.remExpandCustomValidation();
          }
     }

     switchToCustomSize(value: string) {
          this.showCustomSizes = (value === 'custom') ? true : false;
     }

     setEmailType(value) {
          if (this.hideSize) {
               this.creativeGroup.get('size').get('std_size').setValue('')
          }
     }

     setBaseSizeValidation() {
          // console.log('jsjsjs')
          this.stdSizes.setValidators([Validators.required]);
          this.stdSizes.updateValueAndValidity();
     }

     remBaseSizeValidation() {
          console.log('rem stdValidation')
          this.stdSizes.setValidators(null);
          this.stdSizes.updateValueAndValidity();
     }

     setCustomValidation() {
          this.customSize.setValidators([Validators.required, this.sizeValidator()]);
          this.customSize.updateValueAndValidity();
     }

     remCustomValidation() {
          this.customSize.setValidators(null);
          this.customSize.updateValueAndValidity();
     }

     setExpandCustomValidation() {
          this.expandSize.setValidators([Validators.required, this.sizeValidator(true, 'custom_size')]);
          this.expandSize.updateValueAndValidity();
     }

     remExpandCustomValidation() {
          this.expandSize.setValidators(null);
          this.updateAllValidation();
     }

     setVersionNameRequiered(validator = true) {
          setTimeout(() => {
               this.showVersionName = true;
               if (validator) {
                    // console.log('running validator')
                    this.versionNameController.setValidators([Validators.required, this.custumNameCharValidation(/[^A-Za-z0-9-]+|(-)\1/)]);
                    
               } else {
                    this.versionNameController.setValidators([this.custumNameCharValidation(/[^A-Za-z0-9-]+|(-)\1/)]);
               }
               this.versionNameController.updateValueAndValidity();

          }, 0);
     }

     custumNameCharValidation(nameRe: RegExp) {
          return (control: AbstractControl): { [key: string]: any } => {
               const forbidden = nameRe.test(control.value);
               const found = (control.value) ? control.value.match(nameRe) : '';

               return forbidden ? { 'invalidCharacters': { value: found } } : null;
          };
     }




     removeVersionNameRequired() {
          this.versionNameController.setValidators(null);
          this.versionNameController.updateValueAndValidity();
     }


     updateAllValidation() {
          Object.keys(this.sizeGroupController.controls).forEach(key => {
               this.sizeGroupController.controls[key].updateValueAndValidity();
          });
     }


     removeAllValidatorSize() {
          Object.keys(this.sizeGroupController.controls).forEach(key => {
               this.sizeGroupController.controls[key].setValidators(null);
               this.sizeGroupController.controls[key].updateValueAndValidity();
          });
     }

     isCustomSize() {
          if (this.showCustomSizes) {
               return { 'show-custom': true, 'hide-custom': false };
          } else {
               return { 'show-custom': false, 'hide-custom': true };
          }
     }

     onShowOptions(value: string): boolean {
          return (value === 'RichMedia') ? true : false;
     }

     applyDinamic() {
          const cValue = this.creativeGroup.get('type').value;
          const expand = this.creativeGroup.get('options').get('expandable').value;
          const setSize = this.creativeGroup.get('size').get('std_size').value;

          setTimeout(() => {
               // console.log('setting dynamic timeout', cValue)
               this.showCustomSizes = (setSize === 'custom') ? true : false;
               this.setBGcolor(cValue);
               this.runValidation(cValue);
               this.activateSubs();
          }, 0);
     }



     clearSizes() {
          this.sizeGroupController.setValue({
               std_size: null,
               custom_size: null,
               expand_size: null
          }); // clear size
          this.showExpandable = false;
          this.showCustomSizes = false;
          this.hideSize = false;
     }

     setBGcolor(value: string) {
          if (value) {
               const selected = this.crvTypeSer.CreativeTypesList.find(item => {
                    return value === item.name
               });
               this.bgColorClass = selected.color;
          }
     }

     sizeValidator(check = false, nameKey?) {
          /* beautify preserve:start */
          return (control: AbstractControl): { [key: string]: any } => {
               if (control.value) {
                    const sizeGroupsExp = /(\d{2,4})+/g;
                    const sizeCrvExp = /[\d]{2,4}[x]{1}[\d]{2,4}/i;
                    const activeSize = [];
                    const colSize = [];
                    if (sizeCrvExp.test(control.value)) {
                         let sizeArr = sizeGroupsExp.exec(control.value)
                         while (sizeArr !== null && activeSize.length <= 2) {
                              activeSize.push(+sizeArr[1]);
                              sizeArr = sizeGroupsExp.exec(control.value);
                         }
                         if (activeSize[0] > 2000 || activeSize[1] > 2000) {
                              return { tooBig: true }
                         }
                         const parent = control.parent;
                         if (check && parent) {
                              const refValue = control.parent.get(nameKey).value;
                              if (refValue) {
                                   let refsizeArr = sizeGroupsExp.exec(refValue)
                                   while (refsizeArr !== null && colSize.length <= 2) {
                                        colSize.push(+refsizeArr[1]);
                                        refsizeArr = sizeGroupsExp.exec(refValue);
                                   }
                                   if (colSize[0] > activeSize[0] || colSize[1] > activeSize[1]) {
                                        return { exp_small: true }
                                   }
                              }
                         }
                         return null;
                    } else {
                         return { format: true }
                    }
               }
               return null;

          };
          /* beautify preserve:end */
     }
}
