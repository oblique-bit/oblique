import {Directive} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';

@Directive({
	selector: '[obErrorMessages]',
	exportAs: 'obErrorMessages'
})
export class ObMockErrorMessagesDirective {
	readonly errors$: Observable<ValidationErrors>;
}
