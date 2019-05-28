import { Pipe, PipeTransform } from '@angular/core';
import { IProductionListTableItem } from './campaign-list/campaign-list.component';
// import { Observable } from 'rxjs/Observable';

@Pipe({
  name: 'filterName',
  pure: false
})
export class FilterNamePipe implements PipeTransform {

  transform(value: any, term: string): any {
    if (!value || !term) { return value };

    return value.filter((item: IProductionListTableItem) => {
      return item.server_name.toLowerCase().includes(term.toLowerCase());
    });
    // return Observable.of(filteredItems).delay(1000);


  }

}
