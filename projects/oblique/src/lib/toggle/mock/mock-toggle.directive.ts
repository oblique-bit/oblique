import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[orToggle]',
	exportAs: 'orToggle'
})
export class MockToggleDirective {
	@Input() active = false;
	@Input('class') hostClass: string;
	@Input('orToggle') direction: string;
	@Input() after = false;

	toggle() {
		this.active = !this.active;
	}
}
