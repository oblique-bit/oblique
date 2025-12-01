import {Component, inject} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';

@Component({
	selector: 'sb-nested-form-grandchild-sample',
	standalone: false,
	templateUrl: './nested-form-grandchild-sample.component.html',
	styleUrl: './mandatory.scss',
	exportAs: 'grandChild',
})
export class NestedFormGrandChildSampleComponent {
	grandChildForm = inject(UntypedFormBuilder).group({
		field1: ['', [Validators.required]],
		field2: ['', Validators.minLength(5)],
	});
}
