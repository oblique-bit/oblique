import {Component, HostBinding, Input, ViewEncapsulation} from '@angular/core';
import {ObIAlertType} from './alert.model';

@Component({
	selector: 'ob-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-alert ob-angular'}
})
export class ObAlertComponent {
	@HostBinding('class.ob-alert-info') info = true;
	@HostBinding('class.ob-alert-success') success = false;
	@HostBinding('class.ob-alert-warning') warning = false;
	@HostBinding('class.ob-alert-error') error = false;
	icon = 'info';

	private currentType: ObIAlertType = 'info';

	get type(): ObIAlertType {
		return this.currentType;
	}

	@Input() set type(type: ObIAlertType) {
		this.currentType = type;
		this.info = type === 'info';
		this.success = type === 'success';
		this.warning = type === 'warning';
		this.error = type === 'error';
		this.icon = ObAlertComponent.getIcon(this.type);
	}

	private static getIcon(type: string): string {
		switch (type) {
			case 'info':
				return 'info';
			case 'success':
				return 'checkmark';
			case 'warning':
				return 'warning';
			case 'error':
				return 'cancel';
			default:
				return '';
		}
	}
}
