import {Directive, HostListener, Input} from '@angular/core';
import {ColumnToggleProvidesDirective} from './column-toggle-provides.directive';

@Directive({
	selector: '[column-toggle], [data-column-toggle]'
})
export class ColumnToggleDirective   {
	@Input('column-toggle')
	direction: string;

	@HostListener('click')
	onclick() {
		this.parent.toggle(this.direction);
	}

	constructor(private parent: ColumnToggleProvidesDirective) {
	}
}
