import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'mat-select, mat-checkbox, mat-radio-group',
	template: '',
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		multi: true,
		useExisting: forwardRef(() => MockMatFormElementComponent)
	}]
})
export class MockMatFormElementComponent implements ControlValueAccessor {

	registerOnChange(fn: any): void {
	}

	registerOnTouched(fn: any): void {
	}

	setDisabledState(isDisabled: boolean): void {
	}

	writeValue(obj: { firstName?: string, lastName?: string }): void {
	}
}
