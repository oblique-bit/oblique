import {Directive, HostBinding, HostListener, Input} from '@angular/core';

@Directive({
	selector: '[obAriaMenuButton]',
	exportAs: 'obAriaMenuButton'
})
export class ObAriaMenuButtonDirective {
	@Input('obAriaMenuButton') @HostBinding('attr.aria-owns') @HostBinding('attr.aria-controls') target: string;
	@HostBinding('attr.aria-expanded') active = undefined;
	@HostBinding('attr.aria-haspopup') popup = true;

	@HostListener('click')
	@HostListener('keyup.enter')
	onClick(): void {
		this.active = this.active ? undefined : true;
	}
}
