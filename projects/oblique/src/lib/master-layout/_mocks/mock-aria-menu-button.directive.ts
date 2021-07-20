import {Directive, HostBinding, HostListener, Input} from '@angular/core';

@Directive({
	selector: '[obAriaMenuButton]'
})
export class ObMockAriaMenuButtonDirective {
	@Input('obAriaMenuButton') target: string;
	active: boolean;
	popup: boolean;

	onClick(): void {}
}
