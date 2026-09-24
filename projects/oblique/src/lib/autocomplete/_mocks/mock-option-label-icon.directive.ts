import {Directive, input} from '@angular/core';
import {ObEIcon} from '../../icon/icon.model';
import {OptionLabelIconPosition} from '../autocomplete.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obOptionLabelIcon]',
})
export class ObMockOptionLabelIconDirective {
	readonly iconName = input<ObEIcon>();
	readonly iconPosition = input<OptionLabelIconPosition>('end');
}
