import {Component} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'sb-nested-form-grandchild-sample',
	exportAs: 'grandChild',
	templateUrl: './nested-form-grandchild-sample.component.html',
	styleUrls: ['./mandatory.scss']
})
export class NestedFormGrandChildSampleComponent {
	grandChildForm: UntypedFormGroup;

	constructor(private readonly fb: UntypedFormBuilder) {
		this.grandChildForm = this.fb.group({
			field1: ['', [Validators.required]],
			field2: ['', Validators.minLength(5)]
		});
	}
}
