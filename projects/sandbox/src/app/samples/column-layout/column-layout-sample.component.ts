import {Component} from '@angular/core';

@Component({
	selector: 'sb-column-layout-sample',
	templateUrl: './column-layout-sample.component.html'
})
export class ColumnLayoutSampleComponent {
	left = true;
	right = true;
	noLayout = false;
	wider = false;
	overflow = false;
}
