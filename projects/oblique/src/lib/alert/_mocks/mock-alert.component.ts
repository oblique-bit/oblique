import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-alert',
	template: '<ng-content />',
	changeDetection: ChangeDetectionStrategy.Eager,
	exportAs: 'obAlert',
})
export class ObMockAlertComponent {
	@Input() type = 'info';
	info = true;
	success = false;
	warning = false;
	error = false;

	@Input() hasRoleAlert: boolean | undefined;
}
