import {ControlValueAccessor} from '@angular/forms';
import {Component} from '@angular/core';

@Component({
	selector: 'mat-select, mat-slide-toggle, mat-slider',
	template: ``
})
export class ObMockMatElement implements ControlValueAccessor {
	registerOnChange(fn: any): void {}

	registerOnTouched(fn: any): void {}

	setDisabledState(isDisabled: boolean): void {}

	writeValue(obj: any): void {}
}
