import {Directive, Input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obSelectable]',
	exportAs: 'obSelectable',
	standalone: true
})
export class ObMockSelectableDirective {
	@Input() selected = false;
	@Input() tabindex = 0;
	@Input() value: any;
	cursor = 'pointer';
	role = 'checkbox';

	onClick($event: KeyboardEvent | MouseEvent): void {}

	onFocus(): void {}

	focus(): void {}
}
