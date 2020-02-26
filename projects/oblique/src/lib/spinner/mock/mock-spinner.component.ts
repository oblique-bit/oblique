import {Component, Input} from '@angular/core';

@Component({
	selector: 'ob-spinner',
	exportAs: 'obSpinner',
	template: ''
})
export class ObMockSpinnerComponent {
	@Input() channel = '';
	@Input() fixed = false;
	$state = 'out';
}
