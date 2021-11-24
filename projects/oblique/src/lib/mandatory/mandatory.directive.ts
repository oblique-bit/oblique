import {AfterContentChecked, AfterContentInit, Directive, Optional} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {AbstractControl} from '@angular/forms';
import {MatSelect} from '@angular/material/select';
import {MatFormFieldControl} from '@angular/material/form-field/form-field-control';
import {MatChipList} from '@angular/material/chips';

/**
 * @deprecated since version 7.1.0. Should be removed with the version 8.0.0 as it has been directly fixed in Angular (https://github.com/angular/components/pull/23362)
 */
@Directive({
	selector: 'input:not([required]), mat-select:not([required]), select:not([required]), textarea:not([required]), mat-chip-list:not([required])'
})
export class ObMandatoryDirective implements AfterContentInit, AfterContentChecked {
	private formFieldControl: MatInput | MatSelect | MatChipList;

	constructor(@Optional() private matFormField: MatFormField) {}

	ngAfterContentInit() {
		const formFieldControlTemp: MatFormFieldControl<any> = this.matFormField?._control;
		if (formFieldControlTemp instanceof MatInput || formFieldControlTemp instanceof MatSelect || formFieldControlTemp instanceof MatChipList) {
			this.formFieldControl = formFieldControlTemp;
		}
	}

	ngAfterContentChecked() {
		const control: AbstractControl = this.formFieldControl?.ngControl?.control;
		if (control) {
			// Note: this is a workaround for: https://github.com/angular/angular/issues/13461
			// noinspection JSConstantReassignment
			this.formFieldControl.required = control.validator?.({} as AbstractControl)?.required;

			control.updateValueAndValidity();
		}
	}
}
