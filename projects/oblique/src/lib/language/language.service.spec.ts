import {TestBed} from '@angular/core/testing';
import {DateAdapter} from '@angular/material/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subject} from 'rxjs';
import {ObLanguageService} from './language.service';
import {ObILocale} from '../master-layout/master-layout.model';

describe('LanguageService', () => {
	let service: ObLanguageService;
	let translate: TranslateService;

	describe('with invalid locales', () => {
		const mock = {} as TranslateService;
		const localesConfiguration = {
			locales: [],
			defaultLanguage: 'de',
			disabled: false,
			languages: {},
		} as unknown as ObILocale;

		it('should throw', () => {
			const serviceWithInvalidConfig = new ObLanguageService(mock, null, null, null);
			expect(() => serviceWithInvalidConfig.initialize(localesConfiguration)).toThrow(
				"Oblique's language config needs to either define at least 1 locale or to be disabled."
			);
		});
	});

	describe('with valid locales and without DateAdapter', () => {
		const localesConfiguration = {
			locales: ['de-CH', 'fr-CH', 'it-CH'],
			defaultLanguage: 'de',
			disabled: false,
			languages: {de: 'Deutsch', fr: 'Francais', it: 'Italiano'},
		} as ObILocale;
		let onLangChange: Subject<{lang: string; translations: unknown}>;

		beforeEach(() => {
			onLangChange = new Subject<{lang: string; translations: unknown}>();
			const mock = {
				addLangs: jest.fn(),
				setFallbackLang: jest.fn(),
				use: jest.fn(),
				onLangChange,
				getBrowserLang: jest.fn(),
				getFallbackLang: jest.fn(),
				getCurrentLang: jest.fn(),
			};

			jest.spyOn(console, 'warn');

			TestBed.configureTestingModule({
				providers: [{provide: TranslateService, useValue: mock}],
			});

			service = TestBed.inject(ObLanguageService);
			translate = TestBed.inject(TranslateService);
			service.initialize(localesConfiguration);
		});

		it('should be created', () => {
			expect(service).toBeTruthy();
		});

		describe('locale$', () => {
			it('should be an observable', () => {
				expect(service.locale$ instanceof Observable).toBe(true);
			});

			it('should update locale and localStorage on language change', done => {
				onLangChange.next({lang: 'fr', translations: null});
				service.locale$.subscribe(locale => {
					expect(localStorage.getItem('oblique_lang')).toBe('fr');
					expect(locale).toBe('fr-CH');
					done();
				});
			});

			it('should fallback to language code when locale is not configured', done => {
				onLangChange.next({lang: 'es', translations: null});
				service.locale$.subscribe(locale => {
					expect(locale).toBe('es');
					done();
				});
			});
		});
	});

	describe('with disabled locales configuration', () => {
		const localesConfiguration = {
			locales: ['de-CH', 'fr-CH', 'it-CH'],
			defaultLanguage: 'de',
			disabled: true,
			languages: {de: 'Deutsch', fr: 'Francais', it: 'Italiano'},
		} as ObILocale;

		it('should return early and not initialize translation', () => {
			const mock = {
				addLangs: jest.fn(),
				setFallbackLang: jest.fn(),
				use: jest.fn(),
				onLangChange: new Subject<{lang: string; translations: unknown}>(),
				getBrowserLang: jest.fn(),
				getFallbackLang: jest.fn(),
				getCurrentLang: jest.fn(),
			};

			TestBed.configureTestingModule({
				providers: [{provide: TranslateService, useValue: mock}],
			});

			service = TestBed.inject(ObLanguageService);
			translate = TestBed.inject(TranslateService);
			service.initialize(localesConfiguration);

			expect(translate.addLangs).not.toHaveBeenCalled();
			expect(translate.setFallbackLang).not.toHaveBeenCalled();
			expect(translate.use).not.toHaveBeenCalled();
		});
	});

	describe('with valid locales and a DateAdapter', () => {
		const localesConfiguration = {
			locales: ['de-CH', 'fr-CH', 'it-CH'],
			defaultLanguage: 'de',
			disabled: false,
			languages: {de: 'Deutsch', fr: 'Francais', it: 'Italiano'},
		} as ObILocale;

		beforeEach(() => {
			const mock = {
				addLangs: jest.fn(),
				setFallbackLang: jest.fn(),
				use: jest.fn(),
				onLangChange: new Subject<{lang: string; translations: unknown}>(),
				getBrowserLang: jest.fn(),
				getFallbackLang: jest.fn(),
				getCurrentLang: jest.fn().mockReturnValue('de'),
			};

			const dateAdapterMock = {setLocale: jest.fn()};

			jest.spyOn(console, 'warn');

			TestBed.configureTestingModule({
				providers: [
					{provide: DateAdapter, useValue: dateAdapterMock},
					{provide: TranslateService, useValue: mock},
				],
			});

			service = TestBed.inject(ObLanguageService);
			service.initialize(localesConfiguration);
		});

		it('should be created', () => {
			expect(service).toBeTruthy();
		});

		describe('locale$', () => {
			it('should be an observable', () => {
				expect(service.locale$ instanceof Observable).toBe(true);
			});
		});
	});

	describe('with locale objects', () => {
		const localesConfiguration = {
			locales: [{locale: 'de-CH'}, {locale: 'fr-CH'}, {locale: 'it-CH'}],
			defaultLanguage: 'de',
			disabled: false,
			languages: {de: 'Deutsch', fr: 'Francais', it: 'Italiano'},
		} as ObILocale;

		beforeEach(() => {
			const mock = {
				addLangs: jest.fn(),
				setFallbackLang: jest.fn(),
				use: jest.fn(),
				onLangChange: new Subject<{lang: string; translations: unknown}>(),
				getBrowserLang: jest.fn(),
				getFallbackLang: jest.fn(),
				getCurrentLang: jest.fn(),
			};

			TestBed.configureTestingModule({
				providers: [{provide: TranslateService, useValue: mock}],
			});

			service = TestBed.inject(ObLanguageService);
			translate = TestBed.inject(TranslateService);
			service.initialize(localesConfiguration);
		});

		it('should initialize languages from object locales', () => {
			expect(translate.addLangs).toHaveBeenCalledWith(['de', 'fr', 'it']);
		});
	});

	describe('with unsupported browser and default languages', () => {
		const localesConfiguration = {
			locales: ['de-CH', 'fr-CH'],
			defaultLanguage: 'it',
			disabled: false,
			languages: {de: 'Deutsch', fr: 'Francais'},
		} as ObILocale;

		beforeEach(() => {
			localStorage.removeItem('oblique_lang');
			const mock = {
				addLangs: jest.fn(),
				setFallbackLang: jest.fn(),
				use: jest.fn(),
				onLangChange: new Subject<{lang: string; translations: unknown}>(),
				getBrowserLang: jest.fn().mockReturnValue('es'),
				getFallbackLang: jest.fn().mockReturnValue('pt'),
				getCurrentLang: jest.fn(),
			};

			TestBed.configureTestingModule({
				providers: [{provide: TranslateService, useValue: mock}],
			});

			service = TestBed.inject(ObLanguageService);
			translate = TestBed.inject(TranslateService);
			service.initialize(localesConfiguration);
		});

		it('should fallback to first language for current language', () => {
			expect(translate.use).toHaveBeenCalledWith('de');
		});

		it('should fallback to first language for default language', () => {
			expect(translate.setFallbackLang).toHaveBeenCalledWith('de');
		});
	});
});
