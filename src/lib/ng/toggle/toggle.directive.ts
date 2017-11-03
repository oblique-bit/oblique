import {Directive, HostBinding, HostListener} from '@angular/core';

@Directive({
	selector: '[orToggle]',
	exportAs: 'orToggle'
})
export class ToggleDirective {
	@HostBinding('class.show') active = false;
	@HostListener('click') activate() {
		this.active = !this.active;
	}
}
