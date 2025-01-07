import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ObErrorMessagesModule} from '@oblique/oblique';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
	selector: 'app-error-messages-example-reactive-form-preview',
	templateUrl: './error-messages-example-reactive-form-preview.component.html',
	imports: [ReactiveFormsModule, ObErrorMessagesModule, MatFormFieldModule, MatInputModule]
})
export class ErrorMessagesExampleReactiveFormPreviewComponent {
	form: FormGroup;
	private readonly formBuilder = inject(FormBuilder);

	constructor() {
		this.form = this.formBuilder.group({
			control: [null, Validators.required]
		});
	}
}
