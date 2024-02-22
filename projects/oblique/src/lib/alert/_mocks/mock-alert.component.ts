import {Component, Input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
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
