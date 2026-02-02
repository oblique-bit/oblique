import {Directive} from '@angular/core';
import {ObSelectableDirective} from '../selectable.directive';
import {of} from 'rxjs';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obSelectableGroup]',
	standalone: true,
	exportAs: 'obSelectableGroup',
})
export class ObMockSelectableGroupDirective<T = any> {
	role = 'group';
	selected$ = of([] as ObSelectableDirective<T>[]);
	mode$ = of('checkbox');
	mode = 'checkbox';

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
