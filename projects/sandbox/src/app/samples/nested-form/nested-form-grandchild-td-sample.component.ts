import {ChangeDetectionStrategy, Component, viewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
	selector: 'sb-nested-form-grandchild-td-sample',
	standalone: false,
	templateUrl: './nested-form-grandchild-td-sample.component.html',
	styleUrl: './mandatory.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
	exportAs: 'grandChildTD',
})
export class NestedFormGrandChildTDSampleComponent {
	readonly ngForm = viewChild(NgForm);
	field1 = '';
	field2 = '';
}
