import {Component, ViewChild, inject} from '@angular/core';
import {FormGroupDirective, NgForm, UntypedFormBuilder, Validators} from '@angular/forms';
import {ObNotificationService} from '@oblique/oblique';

@Component({
	selector: 'sb-nested-form-sample',
	templateUrl: './nested-form-sample.component.html',
	styleUrl: './mandatory.scss',
	standalone: false
})
export class NestedFormSampleComponent {
	parentForm = inject(UntypedFormBuilder).group({
		child: [''],
		parent: ['', [Validators.required]]
	});
	model = {
		parent: '',
		child: undefined
	};
	@ViewChild(FormGroupDirective) reactiveForm: FormGroupDirective;
	@ViewChild(NgForm) templateForm: NgForm;
	private readonly notification = inject(ObNotificationService);

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
