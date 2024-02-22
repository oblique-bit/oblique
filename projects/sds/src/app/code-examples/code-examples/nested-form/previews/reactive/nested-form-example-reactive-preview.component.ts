import {Component, inject} from '@angular/core';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ObButtonModule, ObErrorMessagesModule, ObNestedFormModule, ObNotificationModule, ObNotificationService} from '@oblique/oblique';
import {MatFormFieldModule} from '@angular/material/form-field';
import {JsonPipe} from '@angular/common';
import {NestedFormExampleReactivePreviewChildComponent} from './child/nested-form-example-reactive-preview-child.component';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
	selector: 'app-nested-form-example-reactive-preview',
	templateUrl: './nested-form-example-reactive-preview.component.html',
	styleUrls: ['../nested-form-example-preview.scss'],
	standalone: true,
	imports: [
		JsonPipe,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		NestedFormExampleReactivePreviewChildComponent,
		ObButtonModule,
		ObErrorMessagesModule,
		ObNestedFormModule,
		ObNotificationModule,
		ReactiveFormsModule
	]
})
export class NestedFormExampleReactivePreviewComponent {
	readonly channel = 'reactive-channel';
	readonly parentForm: UntypedFormGroup;
	private readonly formBuilder = inject(UntypedFormBuilder);
	private readonly notification = inject(ObNotificationService);

	constructor() {
		this.parentForm = this.formBuilder.group({
			child: [
				{
					field1: '',
					field2: '',
					grandchild: {
						field1: '',
						field2: ''
					}
				}
			],
			parent: ['', [Validators.required]]
		});
	}

	validateForm(valid: boolean): void {
		this.notification.config.channel = this.channel;

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
