import {Component, inject, viewChild} from '@angular/core';
import {FormGroupDirective, NgForm, UntypedFormBuilder, Validators} from '@angular/forms';
import {ObNotificationService} from '@oblique/oblique';

@Component({
	selector: 'sb-nested-form-sample',
	standalone: false,
	templateUrl: './nested-form-sample.component.html',
	styleUrl: './mandatory.scss'
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
	readonly reactiveForm = viewChild(FormGroupDirective);
	readonly templateForm = viewChild(NgForm);
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
