import {
	Component,
	DOCUMENT,
	type OnChanges,
	type OnInit,
	type SimpleChange,
	type SimpleChanges,
	ViewEncapsulation,
	booleanAttribute,
	inject,
	input,
	numberAttribute,
	output,
} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {ObServiceNavigationModule} from '../../../oblique/src/lib/service-navigation/service-navigation.module';
import {
	ObEPamsEnvironment,
	type ObIServiceNavigationContact,
	type ObIServiceNavigationLink,
	type ObLoginState,
} from '../../../oblique/src/lib/service-navigation/service-navigation.model';
import {appVersion} from './version';
import type {ObEIcon} from '../../../oblique/src/lib/icon/icon.model';
import {ObButtonModule} from '../../../oblique/src/lib/button/button.module';
import {TranslationsService} from './translations-service';
import type {ObICustomButton, ObILink} from './service-navigation-web-component.model';
import {MatTooltipModule} from '@angular/material/tooltip';
import {outputFromObservable} from '@angular/core/rxjs-interop';

@Component({
	selector: 'ob-service-navigation-web-component',
	imports: [
		ObServiceNavigationModule,
		MatButtonModule,
		MatTooltipModule,
		MatIconModule,
		MatBadgeModule,
		ObButtonModule,
	],
	templateUrl: './service-navigation-web-component.component.html',
	styleUrls: [
		'./service-navigation-web-component.component.scss',
		'../../../oblique/src/styles/scss/oblique-material.scss',
		'../../../oblique/src/styles/scss/core/components/_popover.scss',
		'../../../oblique/src/styles/scss/core/components/_external-link.scss',
	],
	providers: [TranslationsService],
	encapsulation: ViewEncapsulation.None,
	host: {
		'(window:keydown)': 'removeOutline()',
		'(window:keydown.arrowDown)': 'addOutline()',
		'(window:keydown.arrowLeft)': 'addOutline()',
		'(window:keydown.arrowRight)': 'addOutline()',
		'(window:keydown.arrowUp)': 'addOutline()',
		'(window:keydown.shift.tab)': 'addOutline()',
		'(window:keydown.tab)': 'addOutline()',
		'(window:mousedown)': 'removeOutline()',
		'ob-version': appVersion,
	},
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
	readonly maxFavoriteApplications = input(8, {transform: numberAttribute});
	readonly displayLanguages = input(true, {transform: booleanAttribute});
	readonly displayMessage = input(true, {transform: booleanAttribute});
	readonly displayInfo = input(true, {transform: booleanAttribute});
	readonly displayApplications = input(true, {transform: booleanAttribute});
	readonly displayProfile = input(true, {transform: booleanAttribute});
	readonly displayAuthentication = input(true, {transform: booleanAttribute});
	readonly eportalLanguageSynchronization = input(false, {transform: booleanAttribute});
	readonly handleLogout = input<boolean, unknown>(undefined, {transform: booleanAttribute});
	readonly pamsAppId = input<string>(undefined);
	readonly rootUrl = input<string>(undefined);
	readonly returnUrl = input<string>(undefined);
	readonly customButtons = input<string>(undefined);
	readonly languageChange = outputFromObservable<string>(inject(TranslationsService).languageChange$);
	readonly loginState = output<ObLoginState>();
	readonly buttonClickedEmitter = output<ObEIcon>();
	readonly logoutTriggered = output<string>();

	environmentParsed: ObEPamsEnvironment;
	infoContactParsed: ObIServiceNavigationContact | undefined;
	infoLinksParsed: ObIServiceNavigationLink[] = [];
	profileLinksParsed: ObIServiceNavigationLink[] = [];
	customButtonsParsed: ObICustomButton[] = [];
	private readonly translationService = inject(TranslationsService);
	private readonly document = inject(DOCUMENT);

	removeOutline(): void {
		this.document.querySelector('ob-service-navigation-web-component').classList.remove('ob-outline');
	}

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

	private invalidAttributeValue(attributeName: string): void {
		throw new Error(
			`The value for the attribute ${attributeName} is invalid. Check the documentation at https://oblique.bit.admin.ch/guidelines/service-navigation-web-component for the expected format.`
		);
	}

	private parseAttributeValue(attributeName: string, attributeValue: string, fallback: string | null): unknown {
		let result: unknown = null;
		try {
			result = JSON.parse(attributeValue || fallback);
		} catch {
			this.invalidAttributeValue(attributeName);
		}

		return result;
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
		return typeof infoContact?.currentValue === 'string'
			? this.parseAttributeValue('info-contact', infoContact.currentValue, null)
			: this.infoContactParsed;
	}

	private parseLinks(rawLinks: SimpleChange | undefined, type: 'info' | 'profile'): ObIServiceNavigationLink[] {
		if (!rawLinks) {
			return type === 'info' ? this.infoLinksParsed : this.profileLinksParsed;
		}
		const links = this.parseRawLinks(rawLinks.currentValue, type);
		return links.map((link, index) => ({
			url: `${type}-link.${index}.url`,
			label: `${type}-link.${index}.label`,
		}));
	}

	private parseRawLinks(links: unknown, type: 'info' | 'profile'): ObILink[] {
		const parsedLinks: unknown =
			typeof links === 'string' ? this.parseAttributeValue(`${type}-links`, links, '[]') : [];
		return Array.isArray(parsedLinks) ? parsedLinks : [];
	}

	private parseCustomButtons(customButtons: SimpleChange | undefined): ObICustomButton[] {
		const customButtonsParsed =
			typeof customButtons?.currentValue === 'string'
				? this.parseAttributeValue('custom-buttons', customButtons.currentValue, '[]')
				: this.customButtonsParsed;

		return Array.isArray(customButtonsParsed) ? customButtonsParsed : [];
	}

	private handleNewLanguage(language: SimpleChange | undefined): void {
		if (typeof language?.currentValue === 'string') {
			this.translationService.setLang(language.currentValue);
		}
	}
}
