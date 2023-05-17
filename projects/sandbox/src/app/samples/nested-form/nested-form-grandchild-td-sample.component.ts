import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
	selector: 'sb-nested-form-grandchild-td-sample',
	exportAs: 'grandChildTD',
	templateUrl: './nested-form-grandchild-td-sample.component.html',
	styleUrls: ['./mandatory.scss']
})
export class NestedFormGrandChildTDSampleComponent {
	@ViewChild(NgForm, {static: true}) ngForm;
	field1 = '';
	field2 = '';
}
