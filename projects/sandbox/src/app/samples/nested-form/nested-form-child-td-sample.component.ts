import {Component, viewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
	selector: 'sb-nested-form-child-td-sample',
	standalone: false,
	templateUrl: './nested-form-child-td-sample.component.html',
	styleUrl: './mandatory.scss',
	exportAs: 'childTD',
})
export class NestedFormChildTDSampleComponent {
	readonly ngForm = viewChild(NgForm);
	field1 = '';
	field2 = '';
	grandchild;
}
