import {ChangeDetectionStrategy, Component, input} from '@angular/core';

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
	readonly type = input('info');
	info = true;
	success = false;
	warning = false;
	error = false;

	readonly hasRoleAlert = input<boolean | undefined>();
}
