import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'sb-column-layout-sample',
	standalone: false,
	templateUrl: './column-layout-sample.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class ColumnLayoutSampleComponent {
	left = 'OPENED';
	right = 'OPENED';
	noLayout = false;
	wider = false;
	overflow = false;
}
