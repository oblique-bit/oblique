import {Injectable, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import * as translationsDE from '../../../oblique/src/assets/i18n/oblique-de.json';
import * as translationsFR from '../../../oblique/src/assets/i18n/oblique-fr.json';
import * as translationsIT from '../../../oblique/src/assets/i18n/oblique-it.json';
import * as translationsEN from '../../../oblique/src/assets/i18n/oblique-en.json';

@Injectable()
export class TranslationsService {
	private readonly translate = inject(TranslateService);

	initializeTranslations(languageList: string, defaultLanguage: string | undefined): void {
		const languages = this.parseLanguages(languageList);
		const parsedDefaultLanguage = this.parseDefaultLanguage(defaultLanguage, languages);
		this.registerLanguagesAndTranslations(languages, parsedDefaultLanguage);
	}

	private parseLanguages(languageList: string): string[] {
		if (!languageList || !/^[a-z]{2}(?:,[a-z]{2})*$/.test(languageList)) {
			throw new Error(
				`"language-list" expects a comma separated list of ISO 639-1 languages (e.g. en,fr,de) but received "${languageList}"`
			);
		}
		return languageList.split(',');
	}

	private parseDefaultLanguage(defaultLanguage: string | undefined, languages: string[]): string {
		if (defaultLanguage && !/^[a-z]{2}$/.test(defaultLanguage)) {
			throw new Error(`"default-language" expects an ISO 639-1 language (e.g. en) but received "${defaultLanguage}"`);
		}
		if (!languages.includes(defaultLanguage)) {
			const language = languages[0];
			console.info(`No or invalid default language is provided, falling back to ${language}`);
			return language;
		}
		return defaultLanguage;
	}

	private registerLanguagesAndTranslations(languages: string[], defaultLanguage: string): void {
		this.translate.addLangs(languages);
		languages.forEach(language => {
			this.translate.setTranslation(language, this.getObliqueTranslations(language));
		});
		this.translate.setDefaultLang(defaultLanguage);
		this.translate.use(defaultLanguage);
	}

	private getObliqueTranslations(language: string): Record<any, string> {
		switch (language) {
			case 'de':
				return translationsDE;
			case 'fr':
				return translationsFR;
			case 'it':
				return translationsIT;
			case 'en':
				return translationsEN;
			default:
				throw new Error(`Unknown "${language}" language`);
		}
	}
}
