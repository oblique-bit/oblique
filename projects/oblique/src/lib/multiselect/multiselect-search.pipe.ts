import {Pipe, PipeTransform} from '@angular/core';
import {ObMultiselectComponent} from './multiselect.component';

@Pipe({
	name: 'searchFilter'
})
export class ObMultiselectSearchPipe implements PipeTransform {
	constructor(private readonly multiselectDropdown: ObMultiselectComponent) {}

	transform(options: any[], searchString = ''): any[] {
		return options.filter(option => this.multiselectDropdown.formatOptionForLabel(option).toLowerCase().includes(searchString.toLowerCase()));
	}
}
