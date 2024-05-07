import {ObNotificationService} from '@oblique/oblique';
import {Component, OnInit, inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'sb-focus-invalid-sample',
	templateUrl: './focus-invalid-sample.component.html',
	styleUrls: ['./focus-invalid-sample.component.scss']
})
export class FocusInvalidSampleComponent implements OnInit {
	focusInvalidFormGroup: FormGroup;

	text: string;
	datepicker: string;
	select: string;
	textarea: string;
	checkbox: boolean;
	radio: string;

	private readonly formBuilder: FormBuilder = inject(FormBuilder);
	private readonly notification = inject(ObNotificationService);

	ngOnInit(): void {
		this.focusInvalidFormGroup = this.formBuilder.group({
			text: ['', Validators.required],
			datepicker: ['', Validators.required],
			select: ['', Validators.required],
			checkbox: ['', Validators.required],
			textarea: ['', Validators.required],
			radio: ['', Validators.requiredTrue]
		});
	}

	validateForm(valid: boolean): void {
		if (valid) {
			this.notification.success('Form valid!');
		} else {
			this.notification.error('Form not valid!');
		}
	}
}
