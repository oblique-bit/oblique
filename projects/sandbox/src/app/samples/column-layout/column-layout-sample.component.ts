import {Component} from '@angular/core';

@Component({
	selector: 'sb-column-layout-sample',
	templateUrl: './column-layout-sample.component.html',
	standalone: false
})
export class ColumnLayoutSampleComponent {
	left = 'OPENED';
	right = 'OPENED';
	noLayout = false;
	wider = false;
	overflow = false;
}
