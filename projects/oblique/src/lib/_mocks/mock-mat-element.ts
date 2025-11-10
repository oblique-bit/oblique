import {ControlValueAccessor} from '@angular/forms';
import {Component} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'mat-select, mat-slide-toggle, mat-slider',
	standalone: true,
	template: ``,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ObMockMatElement implements ControlValueAccessor {
	registerOnChange(fn: any): void {}

	registerOnTouched(fn: any): void {}

	setDisabledState(isDisabled: boolean): void {}

	writeValue(obj: any): void {}
}
