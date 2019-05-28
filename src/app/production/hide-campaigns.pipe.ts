import { Pipe, PipeTransform } from '@angular/core';
import { IProductionListTableItem } from './campaign-list/campaign-list.component';

@Pipe({
	name: 'hideCampaigns',
	pure: false
})
export class HideCampaignsPipe implements PipeTransform {

	transform(value: any, showHidden = false): any {
		if (!value || showHidden) { return value };

		return value.filter((item: IProductionListTableItem) => {
			return item.hidden === 0;
		});
	}

}
