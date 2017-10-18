import {Directive, HostBinding} from '@angular/core';

@Directive({
	selector: '[orColumn]'
})
export class ColumnDirective {

	@HostBinding('class.column-expanded-right')
	private right = false;

	@HostBinding('class.column-expanded-left')
	private left = false;

	toggle(panel: string): void {
		this[panel] = !this[panel];
	}
}
