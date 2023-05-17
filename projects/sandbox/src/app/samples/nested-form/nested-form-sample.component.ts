import {Component, ViewChild} from '@angular/core';
import {FormGroupDirective, NgForm, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ObNotificationService} from '@oblique/oblique';

@Component({
	selector: 'sb-nested-form-sample',
	templateUrl: './nested-form-sample.component.html',
	styleUrls: ['./mandatory.scss']
})
export class NestedFormSampleComponent {
	parentForm: UntypedFormGroup;
	model = {
		parent: '',
		child: undefined
	};
	@ViewChild(FormGroupDirective) reactiveForm: FormGroupDirective;
	@ViewChild(NgForm) templateForm: NgForm;

	constructor(private readonly fb: UntypedFormBuilder, private readonly notification: ObNotificationService) {
		this.parentForm = this.fb.group({
			child: [''],
			parent: ['', [Validators.required]]
		});
	}

	validateForm(valid: boolean): void {
		if (valid) {
			this.notification.success('Form valid!');
		} else {
			this.notification.error('Form not valid!');
		}
	}

	resetForm(): void {
		this.parentForm.reset();
	}
}
