import {DomSanitizer} from '@angular/platform-browser';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {
	Component,
	HostAttributeToken,
	InjectionToken,
	OnInit,
	Signal,
	ViewEncapsulation,
	computed,
	inject,
	input,
} from '@angular/core';
import {ObIAlertType} from './alert.model';
import {alertIcons} from './alert-icons';
import {TranslatePipe} from '@ngx-translate/core';

export const OBLIQUE_HAS_ROLE_ALERT = new InjectionToken<boolean>(
	'Flag to globally add role="alert" per default on all ob-alert components'
);

@Component({
	selector: 'ob-alert',
	imports: [MatIconModule, TranslatePipe],
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {
		'[attr.role]': 'role()',
		'[class.ob-alert-error]': 'error()',
		'[class.ob-alert-info]': 'info()',
		'[class.ob-alert-success]': 'success()',
		'[class.ob-alert-warning]': 'warning()',
		class: 'ob-alert ob-angular',
	},
})
export class ObAlertComponent implements OnInit {
	readonly info = computed(() => this.type() === 'info');
	readonly success = computed(() => this.type() === 'success');
	readonly warning = computed(() => this.type() === 'warning');
	readonly error = computed(() => this.type() === 'error');
	readonly role: Signal<'alert' | undefined>;
	readonly icon = computed(() => `alert:${this.type()}`);
	readonly type = input<ObIAlertType>('info');
	readonly hasRoleAlert = input<boolean | undefined>();

	private readonly hasGlobalAlertRole = inject(OBLIQUE_HAS_ROLE_ALERT, {optional: true});
	private readonly initialRole = inject(new HostAttributeToken('role'), {optional: true});
	private readonly matIconRegistry = inject(MatIconRegistry);
	private readonly domSanitizer = inject(DomSanitizer);
	constructor() {
		this.role = computed(() =>
			(this.hasRoleAlert() ?? this.hasGlobalAlertRole ?? this.initialRole === 'alert') ? 'alert' : undefined
		);
	}

	ngOnInit(): void {
		['info', 'success', 'warning', 'error'].forEach(type => {
			// Sanitation is bypassed because it doesn't allow SVG at all. And since they come from Oblique and not from any user
			this.matIconRegistry.addSvgIconLiteralInNamespace(
				'alert',
				type,
				this.domSanitizer.bypassSecurityTrustHtml(alertIcons[type])
			);
		});
	}
}
