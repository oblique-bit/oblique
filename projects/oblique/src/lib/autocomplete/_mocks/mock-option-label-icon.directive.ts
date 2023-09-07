import {Directive, Input} from '@angular/core';
import {OptionLabelIconPosition} from '../autocomplete.model';

@Directive({
	selector: '[obOptionLabelIcon]',
	standalone: true
})
export class ObMockOptionLabelIconDirective {
	@Input() optionLabelIconName?: string;
	@Input() iconPosition: OptionLabelIconPosition = 'end';
}
