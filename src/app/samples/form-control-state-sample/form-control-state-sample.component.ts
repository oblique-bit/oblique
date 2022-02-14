import {Component} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, ValidationErrors, Validators} from '@angular/forms';
import {ObNotificationService} from '@oblique/oblique';

@Component({
	selector: 'sc-form-control-state-sample',
	templateUrl: './form-control-state-sample.component.html',
	styleUrls: ['./form-control-state-sample.component.scss']
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
			email: ['', Validators.pattern(/^\w+(?:[.-]?\w+)*@\w+(?:[.-]?\w+)*(?:\.\w{2,3})+$/)]
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
		return (): ValidationErrors => ({
			test: {value: 'i18n.validation.testValue'}
		});
	}
}
