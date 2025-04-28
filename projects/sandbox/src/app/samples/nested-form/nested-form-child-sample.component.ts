import {Component, inject} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';

@Component({
	selector: 'sb-nested-form-child-sample',
	exportAs: 'child',
	templateUrl: './nested-form-child-sample.component.html',
	styleUrl: './mandatory.scss',
	standalone: false
})
export class NestedFormChildSampleComponent {
	nestedForm = inject(UntypedFormBuilder).group({
		field1: ['', [Validators.required]],
		field2: [''],
		grandchild: ''
	});
}
