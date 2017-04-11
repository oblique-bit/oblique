import {Pipe, PipeTransform} from '@angular/core';
import {MultiselectComponent} from './multiselect.component';

@Pipe({
    name: 'searchFilter'
})
export class MultiselectSearchPipe implements PipeTransform {

    constructor(private multiselectDropdown: MultiselectComponent) {

    }

    transform(options: any[], searchString: string): any[] {
        searchString = searchString || '';
        return options.filter((option) => {
           return this.multiselectDropdown.formatOptionForLabel(option).toLowerCase().indexOf(searchString.toLowerCase()) > -1;
        });
    }
}
