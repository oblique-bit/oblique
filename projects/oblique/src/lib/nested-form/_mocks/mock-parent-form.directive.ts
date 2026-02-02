import {Directive} from '@angular/core';
import {Observable} from 'rxjs';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obParentFormDirective]',
	standalone: true,
	host: {class: 'ob-parent-form-directive'},
	exportAs: 'obParentFormDirective',
})
export class ObMockParentFormDirective {
	public readonly submit$: Observable<void>;
	public readonly reset$: Observable<void>;

	submit(): void {}

	reset(): void {}
}
