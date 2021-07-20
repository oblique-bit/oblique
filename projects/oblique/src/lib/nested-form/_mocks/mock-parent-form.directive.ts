import {Directive} from '@angular/core';
import {Observable} from 'rxjs';

@Directive({
	selector: '[obParentFormDirective]',
	exportAs: 'obParentFormDirective',
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-parent-form-directive'}
})
export class ObMockParentFormDirective {
	public readonly submit$: Observable<void>;
	public readonly reset$: Observable<void>;

	submit() {}

	reset() {}
}
