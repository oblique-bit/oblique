import {DomSanitizer} from '@angular/platform-browser';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {Attribute, Component, Inject, InjectionToken, Input, OnInit, Optional, ViewEncapsulation} from '@angular/core';
import {ObIAlertType} from './alert.model';
import {alertIcons} from './alert-icons';
import {TranslateModule} from '@ngx-translate/core';

export const OBLIQUE_HAS_ROLE_ALERT = new InjectionToken<boolean>(
	'Flag to globally add role="alert" per default on all ob-alert components'
);

@Component({
	selector: 'ob-alert',
	imports: [MatIconModule, TranslateModule],
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {
		'[attr.role]': `role`,
		'[class.ob-alert-error]': `error`,
		'[class.ob-alert-info]': `info`,
		'[class.ob-alert-success]': `success`,
		'[class.ob-alert-warning]': `warning`,
		class: 'ob-alert ob-angular',
	},
})
export class ObAlertComponent implements OnInit {
	info = true;
	success = false;
	warning = false;
	error = false;
	role: string = this.initialRole;
	icon = 'alert:info';

	private currentType: ObIAlertType = 'info';
	private hasAlertRole: boolean | undefined;

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
		['info', 'success', 'warning', 'error'].forEach(type => {
			// Sanitation is bypassed because it doesn't allow SVG at all. And since they come from Oblique and not from any user
			this.matIconRegistry.addSvgIconLiteralInNamespace(
				'alert',
				type,
				this.domSanitizer.bypassSecurityTrustHtml(alertIcons[type])
			);
		});
	}

	private getAlertRole(): string {
		return (this.hasRoleAlert ?? this.hasGlobalAlertRole ?? (this.initialRole !== null && this.role === 'alert'))
			? 'alert'
			: undefined;
	}
}
