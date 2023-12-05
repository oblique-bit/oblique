import {DomSanitizer} from '@angular/platform-browser';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {Attribute, Component, HostBinding, Inject, InjectionToken, Input, OnInit, Optional, ViewEncapsulation} from '@angular/core';
import {ObIAlertType} from './alert.model';
import {alertIcons} from './alert-icons';
import {TranslateModule} from '@ngx-translate/core';

export const OBLIQUE_HAS_ROLE_ALERT = new InjectionToken<boolean>(
	'Flag to globally add role="alert" per default on all ob-alert components'
);

@Component({
	selector: 'ob-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-alert ob-angular'},
	standalone: true,
	imports: [MatIconModule, TranslateModule]
})
export class ObAlertComponent implements OnInit {
	@HostBinding('class.ob-alert-info') info = true;
	@HostBinding('class.ob-alert-success') success = false;
	@HostBinding('class.ob-alert-warning') warning = false;
	@HostBinding('class.ob-alert-error') error = false;
	@HostBinding('attr.role') role: string = this.initialRole;
	icon = 'alert:info';

	private currentType: ObIAlertType = 'info';
	private hasAlertRole?: boolean | undefined;

	constructor(
		@Optional() @Inject(OBLIQUE_HAS_ROLE_ALERT) private readonly hasGlobalAlertRole: boolean,
		// eslint-disable-next-line @angular-eslint/no-attribute-decorator
		@Attribute('role') private readonly initialRole: string,
		private readonly matIconRegistry: MatIconRegistry,
		private readonly domSanitizer: DomSanitizer
	) {}

	get hasRoleAlert(): boolean | undefined {
		return this.hasAlertRole;
	}

	@Input()
	set hasRoleAlert(hasRoleAlert: boolean | undefined) {
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
		this.icon = `alert:${type}`;
	}

	ngOnInit(): void {
		this.role = this.getAlertRole();
		['info', 'success', 'warning', 'error'].forEach(type =>
			this.matIconRegistry.addSvgIconLiteralInNamespace('alert', type, this.domSanitizer.bypassSecurityTrustHtml(alertIcons[type]))
		);
	}

	private getAlertRole(): string {
		return this.hasRoleAlert ?? this.hasGlobalAlertRole ?? (this.initialRole !== null && this.role === 'alert') ? 'alert' : undefined;
	}
}
