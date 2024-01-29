import {Component, Input, OnInit, ViewEncapsulation, booleanAttribute, inject, numberAttribute} from '@angular/core';
import {NgIf} from '@angular/common';
import {ObServiceNavigationModule} from '../../../oblique/src/lib/service-navigation/service-navigation.module';
import {ObEPamsEnvironment} from '../../../oblique/src/lib/service-navigation/service-navigation.model';
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
export class ObServiceNavigationWebComponentComponent implements OnInit {
	@Input() languageList: string;
	@Input() defaultLanguage: string;
	@Input() environment: 'DEV' | 'REF' | 'TEST' | 'ABN' | 'PROD';
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
	private readonly translationService = inject(TranslationsService);

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
}
