import {Directive, Input} from '@angular/core';
import {OptionLabelIconPosition} from '../autocomplete.model';

@Directive({
	selector: '[obOptionLabelIcon]'
})
export class ObMockOptionLabelIconDirective {
	@Input() optionLabelIconName?: string;
	@Input() iconPosition: OptionLabelIconPosition = 'end';
}
