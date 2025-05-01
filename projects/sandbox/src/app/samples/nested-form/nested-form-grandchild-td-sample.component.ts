import {Component, viewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
	selector: 'sb-nested-form-grandchild-td-sample',
	exportAs: 'grandChildTD',
	templateUrl: './nested-form-grandchild-td-sample.component.html',
	styleUrl: './mandatory.scss',
	standalone: false
})
export class NestedFormGrandChildTDSampleComponent {
	readonly ngForm = viewChild(NgForm);
	field1 = '';
	field2 = '';
}
