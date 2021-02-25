import {Component, Input} from '@angular/core';

@Component({
	selector: 'ob-alert',
	exportAs: 'obAlert',
	template: ''
})
export class ObMockAlertComponent {
	@Input() type = 'info';
	info = true;
	success = false;
	warning = false;
	error = false;
}
