import {Component} from '@angular/core';
import {type AbstractControl, UntypedFormControl, UntypedFormGroup, type ValidatorFn, Validators} from '@angular/forms';

@Component({
	selector: 'sb-error-messages-sample',
	standalone: false,
	templateUrl: './error-messages-sample.component.html',
	styleUrl: './error-messages-sample.component.scss',
})
export class ErrorMessagesSampleComponent {
	select = new UntypedFormControl('', [Validators.required]);
	checkbox = new UntypedFormControl('', [Validators.required]);
	radio = new UntypedFormControl('', [Validators.required]);
	numberInput = new UntypedFormControl('', [Validators.required, Validators.min(0), Validators.max(31)]);
	email = new UntypedFormControl('', [Validators.required, Validators.email, Validators.minLength(5)]);
	forbiddenLetterInput = new UntypedFormControl('', [this.forbidLetterA()]);
	forbiddenLetterToken = new UntypedFormControl('', [this.forbidLetterA()]);
	form = new UntypedFormGroup({
		email: this.email,
		select: this.select,
		numberInput: this.numberInput,
		forbiddenLetterInput: this.forbiddenLetterInput,
		forbiddenLetterToken: this.forbiddenLetterToken,
	});

	private forbidLetterA(): ValidatorFn {
		return (control: AbstractControl<string>) => (control.value?.toLowerCase().includes('a') ? {forbidA: true} : null);
	}
}
