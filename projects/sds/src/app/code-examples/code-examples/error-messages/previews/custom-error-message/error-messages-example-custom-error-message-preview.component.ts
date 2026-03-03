import {Component} from '@angular/core';
import {
	type AbstractControl,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	type ValidatorFn,
	Validators,
} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ObErrorMessagesModule} from '@oblique/oblique';
@Component({
	selector: 'app-error-messages-example-custom-error-message-preview',
	imports: [MatFormFieldModule, MatInputModule, ObErrorMessagesModule, ReactiveFormsModule],
	templateUrl: './error-messages-example-custom-error-message-preview.component.html',
})
export class ErrorMessagesExampleCustomErrorMessagePreviewComponent {
	form: FormGroup = new FormGroup({
		control: new FormControl('', {
			validators: [Validators.required, this.forbidLetterA()],
		}),
	});

	private forbidLetterA(): ValidatorFn {
		return (control: AbstractControl<string>) => (control.value?.toLowerCase().includes('a') ? {forbidA: true} : null);
	}
}
