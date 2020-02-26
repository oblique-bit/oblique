import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[obFormControlState]',
	exportAs: 'obFormControlState'
})
export class ObMockFormControlStateDirective {
	@Input() pristineValidation = false;
	@Input() mandatory;
}
