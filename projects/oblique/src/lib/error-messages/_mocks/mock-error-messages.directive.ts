import {Directive} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obErrorMessages]',
	exportAs: 'obErrorMessages',
})
export class ObMockErrorMessagesDirective {
	readonly errors$: Observable<ValidationErrors>;
}
