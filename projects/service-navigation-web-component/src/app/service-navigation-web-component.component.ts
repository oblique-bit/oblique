import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChange,
	SimpleChanges,
	ViewEncapsulation,
	booleanAttribute,
	inject,
	numberAttribute
} from '@angular/core';
import {NgIf} from '@angular/common';
import {ObServiceNavigationModule} from '../../../oblique/src/lib/service-navigation/service-navigation.module';
import {ObEPamsEnvironment, ObIServiceNavigationContact} from '../../../oblique/src/lib/service-navigation/service-navigation.model';
import {TranslationsService} from './translations-service';

@Component({
	standalone: true,
	selector: 'ob-service-navigation-web-component',
	templateUrl: './service-navigation-web-component.component.html',
	styleUrl: '../../../oblique/src/styles/scss/oblique-core.scss',
	encapsulation: ViewEncapsulation.None,
	imports: [ObServiceNavigationModule, NgIf],
	providers: [TranslationsService]
})
export class ObServiceNavigationWebComponentComponent implements OnChanges, OnInit {
	@Input() languageList: string;
	@Input() defaultLanguage: string;
	@Input() environment: 'DEV' | 'REF' | 'TEST' | 'ABN' | 'PROD';
	@Input() infoContact: string;
	@Input({transform: numberAttribute}) maxLastUsedApplications: number;
	@Input({transform: numberAttribute}) maxFavoriteApplications: number;
	@Input({transform: booleanAttribute}) displayLanguages: boolean;
	@Input({transform: booleanAttribute}) displayMessage: boolean;
	@Input({transform: booleanAttribute}) displayInfo: boolean;
	@Input({transform: booleanAttribute}) displayApplications: boolean;
	@Input({transform: booleanAttribute}) displayProfile: boolean;
	@Input({transform: booleanAttribute}) displayAuthentication: boolean;
	@Input() rootUrl: string;
	@Input() returnUrl: string;

	environmentParsed: ObEPamsEnvironment;
	infoContactParsed: ObIServiceNavigationContact | undefined;
	private readonly translationService = inject(TranslationsService);

	ngOnChanges(changes: SimpleChanges): void {
		this.infoContactParsed = this.parseContact(changes.infoContact);
	}

	ngOnInit(): void {
		this.translationService.initializeTranslations(this.languageList, this.defaultLanguage);
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
}
