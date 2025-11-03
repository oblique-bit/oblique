import {Component, inject} from '@angular/core';
import {FormBuilder, type FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ObErrorMessagesModule} from '@oblique/oblique';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
	selector: 'app-error-messages-example-reactive-form-preview',
	imports: [ReactiveFormsModule, ObErrorMessagesModule, MatFormFieldModule, MatInputModule],
	templateUrl: './error-messages-example-reactive-form-preview.component.html'
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
