import {Component, Input} from '@angular/core';

@Component({
	selector: 'ob-alert',
	exportAs: 'obAlert',
	template: '<ng-content></ng-content>'
})
export class ObMockAlertComponent {
	@Input() type = 'info';
	info = true;
	success = false;
	warning = false;
	error = false;

	@Input() hasAlertRole: boolean;
}
