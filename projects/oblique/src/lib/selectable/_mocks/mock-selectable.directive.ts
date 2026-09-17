import {Directive, input, model, signal} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obSelectable]',
	exportAs: 'obSelectable',
})
export class ObMockSelectableDirective<T = any> {
	selected = model(false);
	tabindex = model(0);
	value = input<T>();
	cursor = 'pointer';
	role = signal('checkbox');

	onClick($event: KeyboardEvent | MouseEvent): void {}

	onFocus(): void {}

	focus(): void {}
}
