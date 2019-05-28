import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cleanTypeName'
})
export class CleanTypeNamePipe implements PipeTransform {

    transform(value: string): string {
        if (value === 'RichMedia') {
            return 'Rich Media';
        } else if (value === 'Standards') {
            return 'Standard';
        } else {
            return value;
        }
    }

}
