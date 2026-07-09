import {Component, signal} from '@angular/core';
import {ObEIcon, type ObIAutocompleteInputOption} from '@oblique/oblique';
import {
	type AbstractControl,
	FormControl,
	FormGroup,
	type ValidationErrors,
	type ValidatorFn,
	Validators,
} from '@angular/forms';

@Component({
	selector: 'sb-autocomplete-custom-validator',
	standalone: false,
	templateUrl: './autocomplete.component.html',
})
export class AutocompleteCustomValidatorSampleComponent {
	readonly validatedTimes = signal(0);
	formGroup = new FormGroup({
		controlTest: new FormControl('', [Validators.required, this.isAutocompleteOptionValidator()]),
	});
	optionList: ObIAutocompleteInputOption[] = [
		{
			label: 'Graceling realm',
			disabled: false,
			iconName: ObEIcon.ADDRESS_BOOK,
		},
		{
			label: 'Ice-cream',
			disabled: false,
			iconName: ObEIcon.ARCHIVE_BOX,
		},
		{
			label: 'Blue',
			disabled: false,
			iconName: ObEIcon.NOTIFICATION,
		},
	];

	private isAutocompleteOptionValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const formControlValue = control.value;

			this.validatedTimes.update(value => value + 1);
			if (!formControlValue) {
				return null; // empty value – let required validator handle it
			}
			const matched = this.optionList.some(option => option.label.trim() === formControlValue);
			return matched ? null : {invalidSelection: true};
		};
	}
}
