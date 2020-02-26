import {Pipe, PipeTransform} from '@angular/core';
import {ObMultiselectComponent} from './multiselect.component';

@Pipe({
	name: 'searchFilter'
})
export class ObMultiselectSearchPipe implements PipeTransform {

	constructor(private readonly multiselectDropdown: ObMultiselectComponent) {

	}

	transform(options: any[], searchString: string): any[] {
		searchString = searchString || '';
		return options.filter((option) => {
			return this.multiselectDropdown.formatOptionForLabel(option).toLowerCase().indexOf(searchString.toLowerCase()) > -1;
		});
	}
}
