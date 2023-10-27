import {Component, inject} from '@angular/core';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ObErrorMessagesModule, ObNestedFormModule} from '@oblique/oblique';
import {NestedFormExampleReactivePreviewGrandchildComponent} from '../grandchild/nested-form-example-reactive-preview-grandchild.component';

@Component({
	selector: 'app-nested-form-example-reactive-preview-child',
	exportAs: 'child',
	templateUrl: './nested-form-example-reactive-preview-child.component.html',
	styleUrls: ['../../nested-form-example-preview.scss'],
	standalone: true,
	imports: [
		MatInputModule,
		MatFormFieldModule,
		NestedFormExampleReactivePreviewGrandchildComponent,
		ObErrorMessagesModule,
		ObNestedFormModule,
		ReactiveFormsModule
	]
})
export class NestedFormExampleReactivePreviewChildComponent {
	nestedForm: UntypedFormGroup;
	private readonly formBuilder = inject(UntypedFormBuilder);

	constructor() {
		this.nestedForm = this.formBuilder.group({
			field1: ['', [Validators.required]],
			field2: [''],
			grandchild: [{field1: '', field2: ''}]
		});
	}
}
