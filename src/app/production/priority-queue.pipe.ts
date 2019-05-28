import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'priorityQueue'
})
export class PriorityQueuePipe implements PipeTransform {

	transform(value: any[], args?: any): any {
		if (!Array.isArray(value)) { return value };


		if (value.length === 0) { return value };

		value.sort(function(a, b) {
			let val;
			val = +(a.priority < b.priority) || +(a.priority === b.priority) - 1;
			if (val === 0) {
				let d;
				d = +(a.added_time > b.added_time) || +(a.added_time === b.added_time) - 1;
				return d;
			}
			return val;
		});
		return value;
	}

}
