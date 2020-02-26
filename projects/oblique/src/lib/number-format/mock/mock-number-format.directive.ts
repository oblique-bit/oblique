import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[obNumberFormat]',
	exportAs: 'obNumberFormat'
})
export class ObMockNumberFormatDirective {
	@Input() decimals = 2;
	@Input() persistent = true;

	onBlur(): void {
	}

	onFocus(): void {
	}
}
