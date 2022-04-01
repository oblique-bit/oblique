import {Attribute, Component, HostBinding, Inject, InjectionToken, Input, OnInit, Optional, ViewEncapsulation} from '@angular/core';
import {ObIAlertType} from './alert.model';
import {ObUseObliqueIcons} from '../icon/icon.model';

export const OBLIQUE_HAS_ROLE_ALERT = new InjectionToken<boolean>(
	'Flag to globally add role="alert" per default on all ob-alert components'
);

@Component({
	selector: 'ob-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-alert ob-angular'}
})
export class ObAlertComponent implements OnInit {
	@HostBinding('class.ob-alert-info') info = true;
	@HostBinding('class.ob-alert-success') success = false;
	@HostBinding('class.ob-alert-warning') warning = false;
	@HostBinding('class.ob-alert-error') error = false;
	@HostBinding('class.ob-font-awesome') useFontAwesomeIcons: boolean;
	@HostBinding('attr.role') role: string = this.initialRole;
	icon = 'info';

	private currentType: ObIAlertType = 'info';
	private hasAlertRole?: boolean;

	constructor(
		@Optional() @Inject(ObUseObliqueIcons) private readonly useObliqueIcons: boolean,
		@Optional() @Inject(OBLIQUE_HAS_ROLE_ALERT) private readonly hasGlobalAlertRole: boolean,
		// eslint-disable-next-line @angular-eslint/no-attribute-decorator
		@Attribute('role') private readonly initialRole: string
	) {
		this.useFontAwesomeIcons = !useObliqueIcons;
	}

	get hasRoleAlert(): boolean {
		return this.hasAlertRole;
	}

	@Input()
	set hasRoleAlert(hasRoleAlert: boolean) {
		this.hasAlertRole = hasRoleAlert;
		this.role = this.getAlertRole();
	}

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

	ngOnInit(): void {
		this.role = this.getAlertRole();
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

	private getAlertRole(): string {
		return this.hasRoleAlert ?? this.hasGlobalAlertRole ?? this.role === 'alert' ? 'alert' : undefined;
	}
}
