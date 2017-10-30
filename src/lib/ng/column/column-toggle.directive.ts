import {Directive, HostListener, Input} from '@angular/core';
import {ColumnDirective} from './column.directive';

@Directive({
	selector: '[orColumnToggle]'
})
export class ColumnToggleDirective   {
	@Input('orColumnToggle')
	direction: string;

	@HostListener('click')
	onclick() {
		this.parent.toggle(this.direction);
	}

	constructor(private parent: ColumnDirective) {
	}
}
