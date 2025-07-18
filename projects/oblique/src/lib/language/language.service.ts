import {DOCUMENT, Inject, Injectable, Optional, Renderer2, RendererFactory2} from '@angular/core';
import {DateAdapter} from '@angular/material/core';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ObILocaleObject} from '../master-layout/master-layout.model';
import {ObMasterLayoutConfig} from '../master-layout/master-layout.config';

@Injectable({
	providedIn: 'root'
})
export class ObLanguageService {
	readonly locale$: Observable<string>;
	private static readonly token = 'oblique_lang';
	private readonly locale: BehaviorSubject<string>;

	constructor(
		private readonly translate: TranslateService,
		rendererFactory: RendererFactory2,
		config: ObMasterLayoutConfig,
		@Inject(DOCUMENT) document: Document,
		@Optional() adapter: DateAdapter<unknown>
	) {
		if (!config.locale.disabled) {
			const locales = config.locale.locales.map(locale => (locale as ObILocaleObject).locale || locale) as string[];
			const languages = locales.map(locale => locale.split('-')[0]);
			this.validateLocales(locales);
			this.initTranslateService(languages, config.locale.defaultLanguage);
			this.locale = new BehaviorSubject<string>(this.getLocale(locales, translate.currentLang));
			this.locale$ = this.locale.asObservable();
			this.languageChange(locales, rendererFactory.createRenderer(null, null), document.head.parentElement);
			this.setLocaleOnDateAdapter(adapter);
		}
	}

	private validateLocales(locales: string[]): void {
		if (!Array.isArray(locales) || !locales.length) {
			throw new Error("Oblique's MasterLayout config needs to either define at least 1 locale or to be disabled.");
		}
	}

	private getLocale(locales: string[], language: string): string {
		return locales.find(lang => lang.split('-')[0] === language) || language;
	}

	private initTranslateService(languages: string[], defaultLanguage: string): void {
		this.translate.addLangs(languages);
		this.translate.setDefaultLang(this.getDefaultLang(languages, defaultLanguage));
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
		return this.getSupportedLang(languages, this.translate.getDefaultLang())
			|| this.getSupportedLang(languages, defaultLanguage)
			|| languages[0];
	}

	private setLocaleOnDateAdapter(adapter: DateAdapter<unknown>): void {
		if (adapter) {
			this.locale$.subscribe(locale => adapter.setLocale(locale));
		}
	}
}
