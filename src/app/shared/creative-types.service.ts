import { Injectable } from '@angular/core';

@Injectable()
export class CreativeTypesService {

    RICHMEDIA = { name: 'RichMedia', color: 'crv-teal' };
    STANDARD = { name: 'Standard', color: 'crv-olive' };
    STATIC = { name: 'Static', color: 'crv-purple' };
    EMAIL = { name: 'Email', color: 'crv-orange' };

    // TAGS = { social: 'SOCIAL', mobile: 'MOBILE', regular: 'REGULAR' };

    // MOBILE_SIZES: string[] = ['300x50', '320x50'];
    // SOCIAL_SIZES: string[] = ['1200x628', '1200x444', '600x600', '1080x1080'];

    STD_SIZES: any[] = [
        { size: '300x250', extra: '', faux: true },
        { size: '728x90', extra: '', faux: true },
        { size: '160x600', extra: '', faux: true },
        { size: '300x600', extra: '', faux: true },
        { size: '970x90', extra: '', faux: true },
        { size: '970x250', extra: '', faux: false },
        { size: '300x50', extra: '- Mobile', faux: true },
        { size: '320x50', extra: '- Mobile', faux: true }];

    RM_EXP_SIZES: any[] = [
        { size: '500x250', extra: '- Collapsed 300x250', faux: true },
        { size: '728x315', extra: '- Collapsed 728x90', faux: true },
        { size: '300x600', extra: '- Collapsed 160x600', faux: true }];

    STAT_SIZES: any[] = [
        { size: '300x250', extra: '', faux: true },
        { size: '728x90', extra: '', faux: true },
        { size: '160x600', extra: '', faux: true },
        { size: '300x50', extra: '- Mobile', faux: true },
        { size: '320x50', extra: '- Mobile', faux: true },
        { size: '600x600', extra: '- FB', faux: false },
        { size: '1200x444', extra: '- FB', faux: false },
        { size: '1200x628', extra: '- FB', faux: false }];

    CreativeTypesList = [this.RICHMEDIA, this.STANDARD, this.STATIC, this.EMAIL];

    constructor() { }

    // getSizeTag(size) {
    //     if (this.MOBILE_SIZES.indexOf(size) != -1) {
    //         return this.TAGS.mobile;
    //     } else if (this.SOCIAL_SIZES.indexOf(size) != -1) {
    //         return this.TAGS.social;
    //     } else {
    //         return this.TAGS.regular;
    //     }
    // }

    showInFauxPage(_type: string, _size: string) {
        const list: { [key: string]: any[] } = { 'Static': this.STAT_SIZES, 'RichMedia': [].concat(this.STD_SIZES, this.RM_EXP_SIZES), 'Standard': this.STD_SIZES }
        return list[_type].some(val => {
            return val.size === _size && val.faux;
        })
    }
}
