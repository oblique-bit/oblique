import {Directive} from '@angular/core';
import {Observable} from 'rxjs';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obParentFormDirective]',
	host: {class: 'ob-parent-form-directive'},
	exportAs: 'obParentFormDirective',
})
export class ObMockParentFormDirective {
	public readonly submit$: Observable<void>;
	public readonly reset$: Observable<void>;

	submit(): void {}

	reset(): void {}
}
