import {Directive, EventEmitter, Input, Output} from '@angular/core';
import {MatDatepicker} from '@angular/material/datepicker';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obInputClear]',
	exportAs: 'obInputClear',
	standalone: true
})
export class ObMockInputClearDirective {
	@Input('obInputClear') control: HTMLInputElement;
	@Input() focusOnClear = true;
	@Input() datePickerRef: MatDatepicker<any>;
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() readonly onClear = new EventEmitter<MouseEvent>();
	cssClass = true;

	onClick($event: MouseEvent): void {}
}
