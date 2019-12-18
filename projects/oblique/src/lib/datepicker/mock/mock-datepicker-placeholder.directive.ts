import {Directive, Input} from '@angular/core';

@Directive({
	selector: 'input[ngbDatepicker]'
})
export class MockDatepickerPlaceholderDirective {
	@Input() placeholder;
}
