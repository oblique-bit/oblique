import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
	selector: 'sb-nested-form-child-td-sample',
	exportAs: 'childTD',
	templateUrl: './nested-form-child-td-sample.component.html',
	styleUrls: ['./mandatory.scss']
})
export class NestedFormChildTDSampleComponent {
	@ViewChild(NgForm, {static: true}) ngForm;
	field1 = '';
	field2 = '';
	grandchild;
}
