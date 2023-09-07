import {Component, Input} from '@angular/core';

@Component({
	selector: 'ob-spinner',
	exportAs: 'obSpinner',
	template: '',
	standalone: true
})
export class ObMockSpinnerComponent {
	@Input() channel = '';
	@Input() fixed = false;
	$state = 'out';
}
