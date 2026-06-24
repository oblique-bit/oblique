import {Directive, input, output} from '@angular/core';
import {MatDatepicker} from '@angular/material/datepicker';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obInputClear]',
	exportAs: 'obInputClear',
})
export class ObMockInputClearDirective {
	readonly control = input<HTMLInputElement>(undefined, {alias: 'obInputClear'});
	readonly focusOnClear = input(true);
	readonly datePickerRef = input<MatDatepicker<any>>(undefined);
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	readonly onClear = output<MouseEvent>();
	cssClass = true;

	onClick($event: MouseEvent): void {}
}
