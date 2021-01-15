import {Directive} from '@angular/core';
import {ObSelectableDirective} from '../selectable.directive';
import {of} from 'rxjs';

@Directive({
	selector: '[obSelectableGroup]',
	exportAs: 'obSelectableGroup'
})
export class ObMockSelectableGroupDirective {
	role = 'group';
	selected$ = of([] as ObSelectableDirective[]);
	mode$ = of('checkbox');
	mode = 'checkbox';

	register(directive: ObSelectableDirective): void {}

	toggle(directive: ObSelectableDirective, ctrl = false, shift = false): void {}

	focus(directive: ObSelectableDirective): void {}

	sort(sortFunction: Function): void {}

	onArrowDown($event: KeyboardEvent): void {}

	onArrowUp($event: KeyboardEvent): void {}

	onShiftArrowDown($event: KeyboardEvent): void {}

	onShiftArrowUp($event: KeyboardEvent): void {}

	onCtrlArrowDown($event: KeyboardEvent): void {}

	onCtrlArrowUp($event: KeyboardEvent): void {}
}
