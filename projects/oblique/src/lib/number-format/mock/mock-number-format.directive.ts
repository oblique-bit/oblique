import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[orNumberFormat]',
	exportAs: 'orNumberFormat'
})
export class MockNumberFormatDirective {
	@Input() decimals = 2;
	@Input() persistent = true;

	onBlur(): void {
	}

	onFocus(): void {
	}
}
