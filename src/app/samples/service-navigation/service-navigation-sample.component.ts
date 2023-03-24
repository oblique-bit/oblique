import {Component, Inject, OnInit} from '@angular/core';
import {ObIServiceNavigationContact, ObIServiceNavigationLink, WINDOW} from '@oblique/oblique';
import {environment} from '../../../environments/environment';

@Component({
	selector: 'sc-service-navigation',
	templateUrl: './service-navigation-sample.component.html',
	styleUrls: ['./service-navigation-sample.component.scss']
})
export class ServiceNavigationSampleComponent implements OnInit {
	returnUrl: string;
	profileLinks: ObIServiceNavigationLink[] = [
		{
			url: 'i18n.service-navigation.profile.link.unicorn.url',
			label: 'i18n.service-navigation.profile.link.unicorn.label'
		},
		{
			url: 'i18n.service-navigation.profile.link.dragon.url',
			label: 'i18n.service-navigation.profile.link.dragon.label'
		},
		{
			url: 'i18n.service-navigation.profile.link.phoenix.url',
			label: 'i18n.service-navigation.profile.link.phoenix.label'
		},
		{
			url: 'i18n.service-navigation.profile.link.ork.url',
			label: 'i18n.service-navigation.profile.link.ork.label'
		},
		{
			url: 'i18n.service-navigation.profile.link.kappa.url',
			label: 'i18n.service-navigation.profile.link.kappa.label'
		}
	];
	hasProfileLinks = true;
	hasInfoLinks = true;
	infoLinks: ObIServiceNavigationLink[] = [
		{
			url: 'i18n.service-navigation.info.link.user-documentation.url',
			label: 'i18n.service-navigation.info.link.user-documentation.label'
		},
		{
			url: 'i18n.service-navigation.info.link.multimedia-manual.url',
			label: 'i18n.service-navigation.info.link.multimedia-manual.label'
		}
	];
	hasContactEmail = true;
	hasContactPhone = true;
	infoContact: ObIServiceNavigationContact = {
		email: 'support@bit.admin.ch',
		tel: '+41 58 461 61 11'
	};
	readonly rootUrl = environment.pams.rootUrl;
	readonly environment = environment.pams.environment;

	private readonly contactInfo: ObIServiceNavigationContact = {
		email: 'support@bit.admin.ch',
		tel: '+41 58 461 61 11'
	};

	constructor(@Inject(WINDOW) private readonly window: Window) {}

	ngOnInit(): void {
		this.returnUrl = this.window.location.href;
	}

	handleContactInfo(): void {
		this.infoContact.email = this.hasContactEmail ? this.contactInfo.email : undefined;
		this.infoContact.tel = this.hasContactPhone ? this.contactInfo.tel : undefined;
	}
}
