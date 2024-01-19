import {Directive, Input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obNumberFormat]',
	exportAs: 'obNumberFormat',
	standalone: true
})
export class ObMockNumberFormatDirective {
	@Input() decimals = 2;
	@Input() persistent = true;

	onBlur(): void {}

	onFocus(): void {}
}
