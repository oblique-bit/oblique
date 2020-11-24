import {Directive} from '@angular/core';
import {ObSelectableDirective} from '../selectable.directive';
import {Observable, of} from 'rxjs';

@Directive({
	selector: '[obSelectableGroup]',
	exportAs: 'obSelectableGroup'
})
export class ObMockSelectableGroupDirective {
	role = 'group';
	selected$: Observable<ObSelectableDirective[]>;
	mode$ = of('checkbox');
	mode = 'checkbox';

	register(directive: ObSelectableDirective): void {}

	toggle(directive: ObSelectableDirective, ctrl = false, shift = false): void {}

	focus(directive: ObSelectableDirective): void {}

	onArrowDown($event: KeyboardEvent): void {}

	onArrowUp($event: KeyboardEvent): void {}

	onShiftArrowDown($event: KeyboardEvent): void {}

	onShiftArrowUp($event: KeyboardEvent): void {}

	onCtrlArrowDown($event: KeyboardEvent): void {}

	onCtrlArrowUp($event: KeyboardEvent): void {}
}
