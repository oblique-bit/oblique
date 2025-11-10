import {Directive, Input} from '@angular/core';
import {OptionLabelIconPosition} from '../autocomplete.model';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obOptionLabelIcon]',
	standalone: true,
})
export class ObMockOptionLabelIconDirective {
	@Input() optionLabelIconName?: string;
	@Input() iconPosition: OptionLabelIconPosition = 'end';
}
