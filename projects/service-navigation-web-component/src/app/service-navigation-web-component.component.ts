import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChange,
	SimpleChanges,
	ViewEncapsulation,
	booleanAttribute,
	inject,
	numberAttribute
} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {Observable} from 'rxjs';
import {ObServiceNavigationModule} from '../../../oblique/src/lib/service-navigation/service-navigation.module';
import {
	ObEPamsEnvironment,
	ObIServiceNavigationContact,
	ObIServiceNavigationLink,
	ObLoginState
} from '../../../oblique/src/lib/service-navigation/service-navigation.model';
import {appVersion} from './version';
import {ObEIcon} from '../../../oblique/src/lib/icon/icon.model';
import {ObButtonModule} from '../../../oblique/src/lib/button/button.module';
import {TranslationsService} from './translations-service';
import {ObICustomButton, ObILink} from './service-navigation-web-component.model';

@Component({
	standalone: true,
	selector: 'ob-service-navigation-web-component',
	templateUrl: './service-navigation-web-component.component.html',
	styleUrls: [
		'./service-navigation-web-component.component.scss',
		'../../../oblique/src/styles/scss/oblique-material.scss',
		'../../../oblique/src/styles/scss/core/components/_popover.scss',
		'../../../oblique/src/styles/scss/core/components/_external-link.scss'
	],
	encapsulation: ViewEncapsulation.None,
	imports: [ObServiceNavigationModule, NgIf, MatButtonModule, MatIconModule, NgFor, MatBadgeModule, ObButtonModule],
	providers: [TranslationsService],
	host: {'ob-version': appVersion}
})
export class ObServiceNavigationWebComponentComponent implements OnChanges, OnInit {
	@Input() languageList: string;
	@Input() defaultLanguage: string;
	@Input() language: string;
	@Input() environment: 'DEV' | 'REF' | 'TEST' | 'ABN' | 'PROD';
	@Input() infoContact: string;
	@Input() infoLinks: string;
	@Input() profileLinks: string;
	@Input({transform: numberAttribute}) maxLastUsedApplications = 3;
	@Input({transform: numberAttribute}) maxFavoriteApplications = 3;
	@Input({transform: booleanAttribute}) displayLanguages = true;
	@Input({transform: booleanAttribute}) displayMessage = false;
	@Input({transform: booleanAttribute}) displayInfo = false;
	@Input({transform: booleanAttribute}) displayApplications = false;
	@Input({transform: booleanAttribute}) displayProfile = false;
	@Input({transform: booleanAttribute}) displayAuthentication = false;
	@Input({transform: booleanAttribute}) handleLogout: boolean;
	@Input() pamsAppId: string;
	@Input() rootUrl: string;
	@Input() returnUrl: string;
	@Input() customButtons: string;
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

	constructor() {
		this.languageChange = this.translationService.languageChange$;
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.infoContactParsed = this.parseContact(changes.infoContact);
		this.infoLinksParsed = this.parseLinks(changes.infoLinks, 'info');
		this.profileLinksParsed = this.parseLinks(changes.profileLinks, 'profile');
		this.customButtonsParsed = this.parseCustomButtons(changes.customButtons);
		this.translationService.handleTranslations(this.infoLinks, this.profileLinks);
		this.handleNewLanguage(changes.language);
	}

	ngOnInit(): void {
		this.translationService.initializeTranslations(this.languageList, this.language, this.defaultLanguage);
		this.translationService.handleTranslations(this.infoLinks, this.profileLinks); // necessary because ngOnChanges is called before ngOnInit
		this.environmentParsed = this.parseEnvironment(this.environment);
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
		// undefined is coalesced into null because JSON.parse(null) is valid
		return infoContact ? JSON.parse(infoContact.currentValue || null) : this.infoContactParsed;
	}

	private parseLinks(rawLinks: SimpleChange | undefined, type: 'info' | 'profile'): ObIServiceNavigationLink[] {
		if (!rawLinks) {
			return type === 'info' ? this.infoLinksParsed : this.profileLinksParsed;
		}
		const links: ObILink[] = JSON.parse(rawLinks.currentValue ?? '[]');
		return links.map((link, index) => ({
			url: `${type}-link.${index}.url`,
			label: `${type}-link.${index}.label`
		}));
	}

	private parseCustomButtons(customButtons: SimpleChange | undefined): ObICustomButton[] {
		return customButtons ? JSON.parse(customButtons.currentValue || '[]') : this.customButtonsParsed;
	}

	private handleNewLanguage(language: SimpleChange | undefined): void {
		if (language) {
			this.translationService.setLang(language.currentValue);
		}
	}
}
