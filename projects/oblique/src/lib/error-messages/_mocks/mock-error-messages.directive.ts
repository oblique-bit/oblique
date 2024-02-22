import {Directive} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obErrorMessages]',
	exportAs: 'obErrorMessages',
	standalone: true
})
export class ObMockErrorMessagesDirective {
	readonly errors$: Observable<ValidationErrors>;
}
