import { Pipe, PipeTransform } from '@angular/core';

export interface Iorder {
    type: string;
    items: any[];
}


@Pipe({
	name: 'creativesByType'
})
export class CreativesByTypePipe implements PipeTransform {

	transform(value: any[], args?: any): any {

		if (!Array.isArray(value)) {
			return value;
		}

		const final: Iorder[] = [];
		const keys: string[] = [];
		value.forEach(elm => {
			const idx = keys.indexOf(elm.tag);
			if (idx === -1) {
				keys.push(elm.tag);
				const obj: Iorder = {type: elm.tag, items: [elm] }
				final.push(obj);
			} else {
				final[idx].items.push(elm)
			}
		});

		return final;
	}

}
