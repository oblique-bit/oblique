import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[obToggle]',
	exportAs: 'obToggle'
})
export class ObMockToggleDirective {
	@Input() active = false;
	@Input('class') hostClass: string;
	@Input('obToggle') direction: string;
	@Input() after = false;

	toggle() {
		this.active = !this.active;
	}
}
