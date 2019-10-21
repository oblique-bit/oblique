import {Directive} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';

@Directive({
	selector: '[orErrorMessages]',
	exportAs: 'orErrorMessages'
})
export class MockErrorMessagesDirective {
	readonly errors$: Observable<ValidationErrors>;
}
