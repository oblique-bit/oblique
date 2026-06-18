import {Directive, HostBinding, HostListener, Input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obAriaMenuButton]',
	standalone: false,
})
export class ObMockAriaMenuButtonDirective {
	@Input('obAriaMenuButton') target: string;
	active: boolean;
	popup: boolean;

	onClick(): void {}
	onEscape(): void {}
}
