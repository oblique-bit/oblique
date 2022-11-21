import {Component} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'sc-nested-form-child-sample',
	exportAs: 'child',
	templateUrl: './nested-form-child-sample.component.html',
	styleUrls: ['./mandatory.scss']
})
export class NestedFormChildSampleComponent {
	nestedForm: UntypedFormGroup;

	constructor(private readonly fb: UntypedFormBuilder) {
		this.nestedForm = this.fb.group({
			field1: ['', [Validators.required]],
			field2: [''],
			grandchild: ''
		});
	}
}
