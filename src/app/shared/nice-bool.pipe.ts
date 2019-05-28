import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'niceBool'
})
export class NiceBoolPipe implements PipeTransform {

	transform(value: any, args?: any): any {
		if (args === undefined) {
			return (value === 1) ? 'True' : 'False';
		} else {
			return (value === 1) ? args.true : args.false;
		}
		// return null;
	}

}
