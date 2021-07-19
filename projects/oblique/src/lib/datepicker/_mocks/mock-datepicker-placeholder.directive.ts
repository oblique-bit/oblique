import {Directive, Input} from '@angular/core';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'input[ngbDatepicker]'
})
export class ObMockDatepickerPlaceholderDirective {
	@Input() placeholder;
}
