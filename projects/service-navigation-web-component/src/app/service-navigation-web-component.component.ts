import {
	Component,
	EventEmitter,
	HostListener,
	type OnChanges,
	type OnInit,
	Output,
	type SimpleChange,
	type SimpleChanges,
	ViewEncapsulation,
	booleanAttribute,
	inject,
	input,
	numberAttribute
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import type {Observable} from 'rxjs';
import {ObServiceNavigationModule} from '../../../oblique/src/lib/service-navigation/service-navigation.module';
import {
	ObEPamsEnvironment,
	type ObIServiceNavigationContact,
	type ObIServiceNavigationLink,
	type ObLoginState
} from '../../../oblique/src/lib/service-navigation/service-navigation.model';
import {appVersion} from './version';
import type {ObEIcon} from '../../../oblique/src/lib/icon/icon.model';
import {ObButtonModule} from '../../../oblique/src/lib/button/button.module';
import {TranslationsService} from './translations-service';
import type {ObICustomButton, ObILink} from './service-navigation-web-component.model';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
	selector: 'ob-service-navigation-web-component',
	templateUrl: './service-navigation-web-component.component.html',
	styleUrls: [
		'./service-navigation-web-component.component.scss',
		'../../../oblique/src/styles/scss/oblique-material.scss',
		'../../../oblique/src/styles/scss/core/components/_popover.scss',
		'../../../oblique/src/styles/scss/core/components/_external-link.scss'
	],
	encapsulation: ViewEncapsulation.None,
	imports: [ObServiceNavigationModule, MatButtonModule, MatTooltipModule, MatIconModule, MatBadgeModule, ObButtonModule],
	providers: [TranslationsService],
	host: {'ob-version': appVersion}
})
export class ObServiceNavigationWebComponentComponent implements OnChanges, OnInit {
	readonly languageList = input<string>(undefined);
	readonly defaultLanguage = input<string>(undefined);
	readonly language = input<string>(undefined);
	readonly environment = input<'DEV' | 'REF' | 'TEST' | 'ABN' | 'PROD'>(undefined);
	readonly infoDescription = input<string>(undefined);
	readonly infoContactText = input<string>(undefined);
	readonly infoContact = input<string>(undefined);
	readonly infoHelpText = input<string>(undefined);
	readonly infoLinks = input<string>(undefined);
	readonly useInfoBackend = input(false, {transform: booleanAttribute});
	readonly profileLinks = input<string>(undefined);
	readonly maxLastUsedApplications = input(3, {transform: numberAttribute});
	readonly maxFavoriteApplications = input(3, {transform: numberAttribute});
	readonly displayLanguages = input(true, {transform: booleanAttribute});
	readonly displayMessage = input(true, {transform: booleanAttribute});
	readonly displayInfo = input(true, {transform: booleanAttribute});
	readonly displayApplications = input(true, {transform: booleanAttribute});
	readonly displayProfile = input(true, {transform: booleanAttribute});
	readonly displayAuthentication = input(true, {transform: booleanAttribute});
	readonly handleLogout = input<boolean, unknown>(undefined, {transform: booleanAttribute});
	readonly pamsAppId = input<string>(undefined);
	readonly rootUrl = input<string>(undefined);
	readonly returnUrl = input<string>(undefined);
	readonly customButtons = input<string>(undefined);
	@Output() readonly languageChange: Observable<string>;
	@Output() readonly loginState = new EventEmitter<ObLoginState>();
	@Output() readonly buttonClickedEmitter = new EventEmitter<ObEIcon>();
	@Output() readonly logoutTriggered = new EventEmitter<string>();

	environmentParsed: ObEPamsEnvironment;
	infoContactParsed: ObIServiceNavigationContact | undefined;
	infoLinksParsed: ObIServiceNavigationLink[] = [];
	profileLinksParsed: ObIServiceNavigationLink[] = [];
	customButtonsParsed: ObICustomButton[] = [];
	private readonly translationService = inject(TranslationsService);
	private readonly document = inject(DOCUMENT);

	constructor() {
		this.languageChange = this.translationService.languageChange$;
	}

	@HostListener('window:mousedown')
	@HostListener('window:keydown')
	removeOutline(): void {
		this.document.querySelector('ob-service-navigation-web-component').classList.remove('ob-outline');
	}

	@HostListener('window:keydown.tab')
	@HostListener('window:keydown.shift.tab')
	@HostListener('window:keydown.arrowUp')
	@HostListener('window:keydown.arrowDown')
	@HostListener('window:keydown.arrowRight')
	@HostListener('window:keydown.arrowLeft')
	addOutline(): void {
		this.document.querySelector('ob-service-navigation-web-component').classList.add('ob-outline');
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.infoContactParsed = this.parseContact(changes.infoContact);
		this.infoLinksParsed = this.parseLinks(changes.infoLinks, 'info');
		this.profileLinksParsed = this.parseLinks(changes.profileLinks, 'profile');
		this.customButtonsParsed = this.parseCustomButtons(changes.customButtons);
		this.translationService.handleTranslations(this.infoLinks(), this.profileLinks());
		this.handleNewLanguage(changes.language);
	}

	ngOnInit(): void {
		this.translationService.initializeTranslations(this.languageList(), this.language(), this.defaultLanguage());
		this.translationService.handleTranslations(this.infoLinks(), this.profileLinks()); // necessary because ngOnChanges is called before ngOnInit
		this.environmentParsed = this.parseEnvironment(this.environment());
	}

	private parseEnvironment(environmentName: string): ObEPamsEnvironment {
		const environmentNames = Object.keys(ObEPamsEnvironment);
		if (!environmentNames.includes(environmentName)) {
			throw new Error(
				`An environment has to be provided, valid values are: ${environmentNames.join(', ')}, but "${environmentName}" has been provided`
			);
		}
		return ObEPamsEnvironment[environmentName];
	}

	private parseContact(infoContact: SimpleChange | undefined): ObIServiceNavigationContact | undefined {
		return typeof infoContact?.currentValue === 'string' ? JSON.parse(infoContact.currentValue || null) : this.infoContactParsed;
	}

	private parseLinks(rawLinks: SimpleChange | undefined, type: 'info' | 'profile'): ObIServiceNavigationLink[] {
		if (!rawLinks) {
			return type === 'info' ? this.infoLinksParsed : this.profileLinksParsed;
		}
		const links = this.parseRawLinks(rawLinks.currentValue);
		return links.map((link, index) => ({
			url: `${type}-link.${index}.url`,
			label: `${type}-link.${index}.label`
		}));
	}

	private parseRawLinks(links: unknown): ObILink[] {
		const parsedLinks: unknown = typeof links === 'string' ? JSON.parse(links || '[]') : [];
		return Array.isArray(parsedLinks) ? parsedLinks : [];
	}

	private parseCustomButtons(customButtons: SimpleChange | undefined): ObICustomButton[] {
		return typeof customButtons?.currentValue === 'string' ? JSON.parse(customButtons.currentValue || '[]') : this.customButtonsParsed;
	}

	private handleNewLanguage(language: SimpleChange | undefined): void {
		if (typeof language?.currentValue === 'string') {
			this.translationService.setLang(language.currentValue);
		}
	}
}
