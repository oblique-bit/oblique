import {Directive, input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obNumberFormat]',
	exportAs: 'obNumberFormat',
})
export class ObMockNumberFormatDirective {
	readonly decimals = input(2);
	readonly persistent = input(true);

	onBlur(): void {}

	onFocus(): void {}
}
