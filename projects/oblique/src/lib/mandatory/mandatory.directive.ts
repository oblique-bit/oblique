import {AfterContentChecked, AfterContentInit, Directive} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {AbstractControl} from '@angular/forms';
import {MatSelect} from '@angular/material/select';
import {MatFormFieldControl} from '@angular/material/form-field/form-field-control';
import {MatChipList} from '@angular/material/chips';

/**
 * Note: this is a workaround for: https://github.com/angular/components/issues/2574
 */
@Directive({
	selector:
		'mat-form-field:has(input:not([required])),' +
		'mat-form-field:has(mat-select:not([required]),' +
		'mat-form-field:has(select:not([required]),' +
		'mat-form-field:has(textarea:not([required])),' +
		'mat-form-field:has(mat-chip-list:not([required]))'
})
export class ObMandatoryDirective implements AfterContentInit, AfterContentChecked {
	private formFieldControl: MatInput | MatSelect | MatChipList;

	constructor(private matFormField: MatFormField) {}

	ngAfterContentInit() {
		const formFieldControlTemp: MatFormFieldControl<any> = this.matFormField._control;
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
