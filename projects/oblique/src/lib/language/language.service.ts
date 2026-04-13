import {DOCUMENT, Injectable, Renderer2, RendererFactory2, inject} from '@angular/core';
import {DateAdapter} from '@angular/material/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable, ReplaySubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {ObILocale, ObILocaleObject} from '../master-layout/master-layout.model';

@Injectable({
	providedIn: 'root',
})
export class ObLanguageService {
	readonly locale$: Observable<string>;
	private static readonly token = 'oblique_lang';
	private readonly locale = new ReplaySubject<string>(1);
	private readonly translate = inject(TranslateService);
	private readonly rendererFactory = inject(RendererFactory2);
	private readonly document = inject<Document>(DOCUMENT);
	private readonly adapter = inject<DateAdapter<unknown>>(DateAdapter, {optional: true});

	constructor() {
		this.locale$ = this.locale.asObservable();
	}

	initialize(localesConfiguration: ObILocale): void {
		const {disabled, locales: localesList, defaultLanguage} = localesConfiguration;

		if (disabled) {
			return;
		}
		const locales = localesList.map(locale => (locale as ObILocaleObject).locale || locale) as string[];
		this.validateLocales(locales);
		const languages = locales.map(locale => locale.split('-')[0]);
		const currentLang = this.getCurrentLang(languages, defaultLanguage);
		const renderer = this.rendererFactory.createRenderer(null, null);
		const html = this.document.head.parentElement;

		this.initTranslateService(languages, defaultLanguage);
		renderer.setAttribute(html, 'lang', currentLang);
		this.locale.next(this.getLocale(locales, currentLang));
		this.languageChange(locales, renderer, html);
		this.setLocaleOnDateAdapter(this.adapter);
	}

	private validateLocales(locales: string[]): void {
		if (!Array.isArray(locales) || !locales.length) {
			throw new Error("Oblique's language config needs to either define at least 1 locale or to be disabled.");
		}
	}

	private getLocale(locales: string[], language: string): string {
		return locales.find(lang => lang.split('-')[0] === language) || language;
	}

	private initTranslateService(languages: string[], defaultLanguage: string): void {
		this.translate.addLangs(languages);
		this.translate.setFallbackLang(this.getDefaultLang(languages, defaultLanguage));
		this.translate.use(this.getCurrentLang(languages, defaultLanguage));
	}

	private languageChange(locales: string[], renderer: Renderer2, html: HTMLElement): void {
		this.translate.onLangChange.pipe(map(lang => lang.lang)).subscribe(lang => {
			localStorage.setItem(ObLanguageService.token, lang);
			renderer.setAttribute(html, 'lang', lang);
			this.locale.next(this.getLocale(locales, lang));
		});
	}

	private getSupportedLang(languages: string[], lang: string): string {
		return languages.includes(lang) ? lang : undefined;
	}

	private getCurrentLang(languages: string[], defaultLanguage: string): string {
		// prettier-ignore
		return this.getSupportedLang(languages, localStorage.getItem(ObLanguageService.token))
			|| this.getSupportedLang(languages, this.translate.getBrowserLang())
			|| this.getSupportedLang(languages, defaultLanguage)
			|| languages[0];
	}

	private getDefaultLang(languages: string[], defaultLanguage: string): string {
		// prettier-ignore
		return this.getSupportedLang(languages, this.translate.getFallbackLang())
			|| this.getSupportedLang(languages, defaultLanguage)
			|| languages[0];
	}

	private setLocaleOnDateAdapter(adapter: DateAdapter<unknown>): void {
		if (adapter) {
			this.locale$.subscribe(locale => adapter.setLocale(locale));
		}
	}
}
