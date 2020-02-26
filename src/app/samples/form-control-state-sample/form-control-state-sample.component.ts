import {Component} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators, ValidationErrors} from '@angular/forms';
import {ObNotificationService} from 'oblique';

@Component({
	selector: 'app-form-control-state-sample',
	templateUrl: './form-control-state-sample.component.html',
	styles: [`
		.form-horizontal label {
			text-align: right;
		}

		.card + .card {
			margin-top: 2rem;
		}
	`]
})
export class FormControlStateSampleComponent {
	formData: FormGroup;

	constructor(private readonly notificationService: ObNotificationService, formBuilder: FormBuilder) {
		this.formData = formBuilder.group({
			numberOptional: '',
			numberMandatory: ['', this.customValidator()],
			numberMandatoryPristine: ['', Validators.required],
			address: formBuilder.group({
				street: ['', [Validators.required, Validators.minLength(5)]],
				number: ['', Validators.required]
			}),
			email: ['', Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]
		});
	}

	check(form?: NgForm): void {
		if ((form || this.formData).valid) {
			this.notificationService.success('Congratulations, your data is valid!');
		} else {
			this.notificationService.warning('Oops, your data does not look to be valid!');
		}
	}

	reset(form?: NgForm): void {
		(form || this.formData).reset();
	}

	private customValidator(): ValidationErrors {
		return (): ValidationErrors => {
			return {
				test: {value: 'i18n.validation.testValue'}
			};
		};
	}
}
