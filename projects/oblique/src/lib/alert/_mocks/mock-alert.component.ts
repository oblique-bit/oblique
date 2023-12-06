import {Component, Input} from '@angular/core';

@Component({
	selector: 'ob-alert',
	exportAs: 'obAlert',
	template: '<ng-content />',
	standalone: true
})
export class ObMockAlertComponent {
	@Input() type = 'info';
	info = true;
	success = false;
	warning = false;
	error = false;

	@Input() hasRoleAlert: boolean | undefined;
}
