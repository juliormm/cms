import { Pipe, PipeTransform } from '@angular/core';
import { IProductionListTableItem } from './campaign-list/campaign-list.component';

@Pipe({
	name: 'filterManager',
	pure: false
})
export class FilterManagerPipe implements PipeTransform {

	transform(value: any, man_name, type): any {
		if (!value || man_name.toLowerCase() === 'all') { return value };

		return value.filter((item: IProductionListTableItem) => {
			if(type == 'ae'){
				if(item.ae_name){
					return item.ae_name.toLowerCase() === man_name.toLowerCase();
				} else {
					return false;
				}
				
			} else {
				if(man_name == 'Theorem'){
					return item.templates === 'hype';
				}
				return item.manager.toLowerCase() === man_name.toLowerCase();
			}
			
		});
	}

}
