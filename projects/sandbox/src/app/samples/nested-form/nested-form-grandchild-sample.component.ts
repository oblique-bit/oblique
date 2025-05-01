import {Component, inject} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';

@Component({
	selector: 'sb-nested-form-grandchild-sample',
	exportAs: 'grandChild',
	templateUrl: './nested-form-grandchild-sample.component.html',
	styleUrl: './mandatory.scss',
	standalone: false
})
export class NestedFormGrandChildSampleComponent {
	grandChildForm = inject(UntypedFormBuilder).group({
		field1: ['', [Validators.required]],
		field2: ['', Validators.minLength(5)]
	});
}
