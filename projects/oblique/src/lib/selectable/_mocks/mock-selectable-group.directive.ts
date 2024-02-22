import {Directive} from '@angular/core';
import {ObSelectableDirective} from '../selectable.directive';
import {of} from 'rxjs';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obSelectableGroup]',
	exportAs: 'obSelectableGroup',
	standalone: true
})
export class ObMockSelectableGroupDirective {
	role = 'group';
	selected$ = of([] as ObSelectableDirective[]);
	mode$ = of('checkbox');
	mode = 'checkbox';

	register(directive: ObSelectableDirective): void {}

	toggle(directive: ObSelectableDirective, ctrl = false, shift = false): void {}

	focus(directive: ObSelectableDirective): void {}

	sort(sortFunction: (a: ObSelectableDirective, b: ObSelectableDirective) => number): void {}

	onArrowDown($event: KeyboardEvent): void {}

	onArrowUp($event: KeyboardEvent): void {}

	onShiftArrowDown($event: KeyboardEvent): void {}

	onShiftArrowUp($event: KeyboardEvent): void {}

	onCtrlArrowDown($event: KeyboardEvent): void {}

	onCtrlArrowUp($event: KeyboardEvent): void {}
}
