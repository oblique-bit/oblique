import {Component, Input} from '@angular/core';

@Component({
	selector: 'or-spinner',
	exportAs: 'orSpinner',
	template: ''
})
export class MockSpinnerComponent {
	@Input() channel = '';
	@Input() fixed = false;
	$state = 'out';
}
