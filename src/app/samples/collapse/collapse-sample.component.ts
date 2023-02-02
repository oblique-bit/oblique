import {Component} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {Duration, IconPosition} from './collapse-sample.model';

@Component({
	selector: 'sc-collapse-sample',
	templateUrl: './collapse-sample.component.html'
})
export class CollapseSampleComponent {
	collapseTitle = 'Collapse title here ';
	duration = new UntypedFormControl('fast');
	iconPosition = new UntypedFormControl('left');
	active = false;

	durations: Duration[] = [
		{value: 'slow', viewValue: 'Slow'},
		{value: 'fast', viewValue: 'Fast'},
		{value: 100, viewValue: '100 ms'},
		{value: 500, viewValue: '500 ms'},
		{value: 1000, viewValue: '1000 ms'},
		{value: 1500, viewValue: '1500 ms'},
		{value: 2000, viewValue: '2000 ms'}
	];

	iconPositions: IconPosition[] = [
		{value: 'left', viewValue: 'Move the icon to the left'},
		{value: 'right', viewValue: 'Move the icon to the right'},
		{value: 'justified', viewValue: 'Justify the icon to the right'},
		{value: 'none', viewValue: 'Do not show the icon'}
	];
}
