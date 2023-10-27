import {Component, inject} from '@angular/core';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ObErrorMessagesModule} from '@oblique/oblique';

@Component({
	selector: 'app-nested-form-example-reactive-preview-grandchild',
	exportAs: 'grandchild',
	templateUrl: './nested-form-example-reactive-preview-grandchild.component.html',
	styleUrls: ['../../nested-form-example-preview.scss'],
	standalone: true,
	imports: [MatInputModule, MatFormFieldModule, ObErrorMessagesModule, ReactiveFormsModule]
})
export class NestedFormExampleReactivePreviewGrandchildComponent {
	grandchildForm: UntypedFormGroup;
	private readonly formBuilder = inject(UntypedFormBuilder);

	constructor() {
		this.grandchildForm = this.formBuilder.group({
			field1: ['', [Validators.required]],
			field2: ['', Validators.minLength(5)]
		});
	}
}
