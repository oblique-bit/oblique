import {Directive, Input} from '@angular/core';
import {OptionLabelIconPosition} from '../autocomplete.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obOptionLabelIcon]',
})
export class ObMockOptionLabelIconDirective {
	@Input() optionLabelIconName?: string;
	@Input() iconPosition: OptionLabelIconPosition = 'end';
}
