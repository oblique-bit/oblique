import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[orFormControlState]',
	exportAs: 'orFormControlState'
})
export class MockFormControlStateDirective {
	@Input() pristineValidation = false;
	@Input() mandatory;
}
