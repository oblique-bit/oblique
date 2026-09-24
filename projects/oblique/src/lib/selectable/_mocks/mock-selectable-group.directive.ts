import {Directive, model, signal} from '@angular/core';
import {ObSelectableDirective} from '../selectable.directive';
import {of} from 'rxjs';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obSelectableGroup]',
	exportAs: 'obSelectableGroup',
})
export class ObMockSelectableGroupDirective<T = any> {
	readonly role = signal('group');
	readonly selected = model<ObSelectableDirective<T>[]>([]);
	readonly mode = model<'checkbox' | 'radio' | 'windows'>('checkbox');

	register(directive: ObSelectableDirective<T>): void {}

	toggle(directive: ObSelectableDirective<T>, ctrl = false, shift = false): void {}

	focus(directive: ObSelectableDirective<T>): void {}

	sort(sortFunction: (a: ObSelectableDirective<T>, b: ObSelectableDirective<T>) => number): void {}

	onArrowDown($event: KeyboardEvent): void {}

	onArrowUp($event: KeyboardEvent): void {}

	onShiftArrowDown($event: KeyboardEvent): void {}

	onShiftArrowUp($event: KeyboardEvent): void {}

	onCtrlArrowDown($event: KeyboardEvent): void {}

	onCtrlArrowUp($event: KeyboardEvent): void {}
}
