import {Injectable, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {type Observable, map} from 'rxjs';

import * as translationsDE from '../../../oblique/src/assets/i18n/oblique-de.json';
import * as translationsFR from '../../../oblique/src/assets/i18n/oblique-fr.json';
import * as translationsIT from '../../../oblique/src/assets/i18n/oblique-it.json';
import * as translationsEN from '../../../oblique/src/assets/i18n/oblique-en.json';
import type {ObILink, ObITranslateObject} from './service-navigation-web-component.model';

@Injectable()
export class TranslationsService {
	readonly languageChange$: Observable<string>;
	private readonly translate = inject(TranslateService);
	private parsedLanguages: string[];
	private parsedDefaultLanguage: string;

	constructor() {
		this.languageChange$ = this.translate.onLangChange.pipe(map(event => event.lang));
	}

	initializeTranslations(languageList: string, language: string | undefined, defaultLanguage: string | undefined): void {
		this.parsedLanguages = this.parseLanguages(languageList);
		this.parsedDefaultLanguage = this.parseDefaultLanguage(defaultLanguage, this.parsedLanguages);
		const parsedLanguage = this.parseLanguage(language, this.parsedDefaultLanguage, this.parsedLanguages);

		this.registerLanguagesAndTranslations(this.parsedLanguages, this.parsedDefaultLanguage, parsedLanguage);
	}

	handleTranslations(infoLinks: string, profileLinks: string): void {
		const languages = this.translate.getLangs();
		const translations = this.buildTranslations(languages, infoLinks, profileLinks);
		languages.forEach(language => {
			this.translate.setTranslation(language, translations[language], true);
		});
	}

	setLang(lang: string): void {
		if (this.parsedLanguages && this.parsedDefaultLanguage) {
			const newLang = this.parseLanguage(lang, this.parsedDefaultLanguage, this.parsedLanguages);
			this.translate.use(newLang);
		}
	}

	addOneTranslation(key: string, value: ObITranslateObject): void {
		Object.entries(value).forEach(([language, translation]) => {
			this.translate.setTranslation(language, {[key]: String(translation)}, true);
		});
	}

	private parseLanguages(languageList: string): string[] {
		if (!languageList || !/^[a-z]{2}(?:,[a-z]{2})*$/u.test(languageList)) {
			throw new Error(
				`"language-list" expects a comma separated list of ISO 639-1 languages (e.g. en,fr,de) but received "${languageList}"`
			);
		}
		return languageList.split(',');
	}

	private parseDefaultLanguage(defaultLanguage: string | undefined, languages: string[]): string {
		this.checkLanguageFormat(defaultLanguage, 'default-language');

		if (!languages.includes(defaultLanguage)) {
			const language = languages[0];
			console.info(`No or invalid default language is provided, falling back to ${language}`);
			return language;
		}
		return defaultLanguage;
	}

	private parseLanguage(language: string | undefined, defaultLanguage: string, languages: string[]): string {
		this.checkLanguageFormat(language, 'language');

		if (!languages.includes(language)) {
			console.info(`Invalid language is provided, falling back to ${defaultLanguage}`);
			return defaultLanguage;
		}
		return language;
	}

	private checkLanguageFormat(language: string | undefined, label: 'default-language' | 'language'): void {
		if (language && !/^[a-z]{2}$/u.test(language)) {
			throw new Error(`"${label}" expects an ISO 639-1 language (e.g. en) but received "${language}"`);
		}
	}

	private registerLanguagesAndTranslations(languages: string[], defaultLanguage: string, language: string): void {
		this.translate.addLangs(languages);
		languages.forEach(lang => {
			this.translate.setTranslation(lang, this.getObliqueTranslations(lang), true);
		});
		this.translate.setDefaultLang(defaultLanguage);
		this.translate.use(language);
	}

	private getObliqueTranslations(language: string): Record<string, string> {
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

	private buildTranslations(languages: string[], infoLinks: string, profileLinks: string): Record<string, Record<string, string>> {
		let translations = this.initializeTranslationsObject(languages);
		translations = this.populateTranslations({rawLinks: infoLinks, type: 'info', languages, translations});
		translations = this.populateTranslations({rawLinks: profileLinks, type: 'profile', languages, translations});
		return translations;
	}

	private initializeTranslationsObject(languages: string[]): Record<string, Record<string, string>> {
		return languages.reduce((translations, language) => ({...translations, [language]: {}}), {});
	}

	private populateTranslations(options: {
		rawLinks: string | undefined;
		type: string;
		languages: string[];
		translations: Record<string, Record<string, string>>;
	}): Record<string, Record<string, string>> {
		const {rawLinks, type, languages, translations} = options;
		if (rawLinks) {
			const links = this.parseRawLinks(rawLinks);
			links.forEach((link, index) => {
				languages
					.map(language => ({language, label: link[language] as unknown}))
					.forEach(({language, label}) => {
						if (typeof label === 'string') {
							translations[language][`${type}-link.${index}.label`] = label;
							if (link.links && typeof link.links[language] === 'string') {
								translations[language][`${type}-link.${index}.url`] = link.links[language];
							}
						}
					});
			});
		}
		return translations;
	}

	private parseRawLinks(links: unknown): ObILink[] {
		const parsedLinks: unknown = typeof links === 'string' ? JSON.parse(links || '[]') : [];
		return Array.isArray(parsedLinks) ? parsedLinks : [];
	}
}
