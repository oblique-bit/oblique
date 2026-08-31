import {ChangeDetectionStrategy, Component, type OnInit, computed, inject, viewChild} from '@angular/core';
import {
	type ObIServiceNavigationContact,
	type ObIServiceNavigationLink,
	type ObLoginState,
	ObServiceNavigationComponent,
	WINDOW,
} from '@oblique/oblique';
import {environment} from '../../../environments/environment';

@Component({
	selector: 'sb-service-navigation',
	standalone: false,
	templateUrl: './service-navigation-sample.component.html',
	styleUrl: './service-navigation-sample.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class ServiceNavigationSampleComponent implements OnInit {
	returnUrl: string;
	readonly eportalAppId = '48';
	maxFavoriteApplications = 8;
	readonly lastUsedApplicationsLength = computed(() => this.headerControlsComponent().lastUsedApplications().length);
	readonly favoriteApplicationsLength = computed(() => this.headerControlsComponent().favoriteApplications().length);
	displayMessage = true;
	displayInfo = true;
	displayApplications = true;
	displayProfile = true;
	displayAuthentication = true;
	displayLanguages = true;
	eportalLanguageSynchronization = false;
	handleLogout = true;
	loginState: ObLoginState;
	logoutURL: string;
	profileLinks: ObIServiceNavigationLink[] = [
		{
			url: 'i18n.service-navigation.profile.link.unicorn.url',
			label: 'i18n.service-navigation.profile.link.unicorn.label',
		},
		{
			url: 'i18n.service-navigation.profile.link.dragon.url',
			label: 'i18n.service-navigation.profile.link.dragon.label',
		},
		{
			url: 'i18n.service-navigation.profile.link.phoenix.url',
			label: 'i18n.service-navigation.profile.link.phoenix.label',
		},
		{
			url: 'i18n.service-navigation.profile.link.ork.url',
			label: 'i18n.service-navigation.profile.link.ork.label',
		},
		{
			url: 'i18n.service-navigation.profile.link.kappa.url',
			label: 'i18n.service-navigation.profile.link.kappa.label',
		},
	];
	hasProfileLinks = true;
	hasInfoLinks = true;
	infoLinks: ObIServiceNavigationLink[] = [
		{
			url: 'i18n.service-navigation.info.link.user-documentation.url',
			label: 'i18n.service-navigation.info.link.user-documentation.label',
		},
		{
			url: 'i18n.service-navigation.info.link.multimedia-manual.url',
			label: 'i18n.service-navigation.info.link.multimedia-manual.label',
		},
	];
	infoHelpText = 'help example text';
	infoContactText = 'contact example text';
	infoDescription = 'description example text';
	hasContactEmail = true;
	hasContactPhone = true;
	hasContactFormUrl = true;
	hasInfoBackend = true;
	infoContact: ObIServiceNavigationContact = {
		email: 'support@bit.admin.ch',
		emailText: 'email detailed text',
		phone: '+41 58 461 61 11',
		phoneText: 'tel detailed text',
		formUrl: 'https://example.com/',
		formUrlText: 'form detailed text',
	};
	hasCustomWidgets = true;
	readonly rootUrl = environment.pams?.rootUrl;
	readonly environment = environment.pams?.environment;

	private readonly contactInfo: ObIServiceNavigationContact = {
		email: 'support@bit.admin.ch',
		emailText: 'email detailed text',
		phone: '+41 58 461 61 11',
		phoneText: 'tel detailed text',
		formUrl: 'https://example.com/',
		formUrlText: 'form detailed text',
	};
	private readonly headerControlsComponent = viewChild(ObServiceNavigationComponent);
	private readonly window = inject<Window>(WINDOW);

	ngOnInit(): void {
		this.returnUrl = this.window.location.href;
	}

	handleContactInfo(): void {
		this.infoContact.email = this.hasContactEmail ? this.contactInfo.email : undefined;
		this.infoContact.phone = this.hasContactPhone ? this.contactInfo.phone : undefined;
		this.infoContact.formUrl = this.hasContactFormUrl ? this.contactInfo.formUrl : undefined;
	}
}
