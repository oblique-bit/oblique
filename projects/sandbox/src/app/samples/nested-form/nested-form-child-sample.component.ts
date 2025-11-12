import {Component, inject} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';

@Component({
	selector: 'sb-nested-form-child-sample',
	standalone: false,
	templateUrl: './nested-form-child-sample.component.html',
	styleUrl: './mandatory.scss',
	exportAs: 'child',
})
export class NestedFormChildSampleComponent {
	nestedForm = inject(UntypedFormBuilder).group({
		field1: ['', [Validators.required]],
		field2: [''],
		grandchild: '',
	});
}
