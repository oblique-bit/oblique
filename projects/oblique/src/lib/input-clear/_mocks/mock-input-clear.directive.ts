import {Directive, EventEmitter, Input, Output} from '@angular/core';
import {MatDatepicker} from '@angular/material/datepicker';

@Directive({
	selector: '[obInputClear]',
	exportAs: 'obInputClear'
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
