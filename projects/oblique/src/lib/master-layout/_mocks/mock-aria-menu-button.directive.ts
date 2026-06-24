import {Directive, HostBinding, HostListener, input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obAriaMenuButton]',
	standalone: false,
})
export class ObMockAriaMenuButtonDirective {
	readonly target = input<string>(undefined, {alias: 'obAriaMenuButton'});
	active: boolean;
	popup: boolean;

	onClick(): void {}
	onEscape(): void {}
}
