import {Directive, HostBinding, HostListener, Input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obAriaMenuButton]'
})
export class ObMockAriaMenuButtonDirective {
	@Input('obAriaMenuButton') target: string;
	active: boolean;
	popup: boolean;

	onClick(): void {}
	onEscape(): void {}
}
