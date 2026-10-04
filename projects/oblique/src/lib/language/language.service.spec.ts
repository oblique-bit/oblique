import {TestBed} from '@angular/core/testing';
import {DateAdapter} from '@angular/material/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subject, firstValueFrom} from 'rxjs';
import {ObLanguageService} from './language.service';
import {ObILocale} from './language.model';
import {WINDOW} from '../window/window.provider';

describe('LanguageService', () => {
	let service: ObLanguageService;
	let translate: TranslateService;

	describe('with invalid locales', () => {
		const mock = {} as TranslateService;
		const localesConfiguration = {
			locales: [],
			defaultLanguage: 'de',
			disabled: false,
		} as unknown as ObILocale;

		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					ObLanguageService,
					{provide: TranslateService, useValue: mock},
					{provide: WINDOW, useValue: window},
				],
			});
			service = TestBed.inject(ObLanguageService);
		});

		it('should throw', () => {
			expect(() => service.initialize(localesConfiguration)).toThrow(
				"Oblique's language config needs to either define at least 1 locale or to be disabled."
			);
		});
	});

	describe('with valid locales and without DateAdapter', () => {
		const localesConfiguration = {
			locales: ['de-CH', 'fr-CH', 'it-CH'],
			defaultLanguage: 'de',
			disabled: false,
		} as ObILocale;
		let onLangChange: Subject<{lang: string; translations: unknown}>;

		beforeEach(() => {
			onLangChange = new Subject<{lang: string; translations: unknown}>();
			const mock = {
				addLangs: vi.fn(),
				setFallbackLang: vi.fn(),
				use: vi.fn(),
				onLangChange,
				getBrowserLang: vi.fn(),
				getFallbackLang: vi.fn(),
				getCurrentLang: vi.fn(),
			};

			vi.spyOn(console, 'warn');

			TestBed.configureTestingModule({
				providers: [
					{provide: TranslateService, useValue: mock},
					{provide: WINDOW, useValue: window},
				],
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

			it('should update locale and localStorage on language change', async () => {
				onLangChange.next({lang: 'fr', translations: null});
				const locale = await firstValueFrom(service.locale$);
				expect(localStorage.getItem('oblique_lang')).toBe('fr');
				expect(locale).toBe('fr-CH');
			});

			it('should fallback to language code when locale is not configured', async () => {
				onLangChange.next({lang: 'es', translations: null});
				const locale = await firstValueFrom(service.locale$);
				expect(locale).toBe('es');
			});
		});
	});

	describe('with disabled locales configuration', () => {
		const localesConfiguration = {
			locales: ['de-CH', 'fr-CH', 'it-CH'],
			defaultLanguage: 'de',
			disabled: true,
		} as ObILocale;

		it('should return early and not initialize translation', () => {
			const mock = {
				addLangs: vi.fn(),
				setFallbackLang: vi.fn(),
				use: vi.fn(),
				onLangChange: new Subject<{lang: string; translations: unknown}>(),
				getBrowserLang: vi.fn(),
				getFallbackLang: vi.fn(),
				getCurrentLang: vi.fn(),
			};

			TestBed.configureTestingModule({
				providers: [
					{provide: TranslateService, useValue: mock},
					{provide: WINDOW, useValue: window},
				],
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
		} as ObILocale;

		beforeEach(() => {
			const mock = {
				addLangs: vi.fn(),
				setFallbackLang: vi.fn(),
				use: vi.fn(),
				onLangChange: new Subject<{lang: string; translations: unknown}>(),
				getBrowserLang: vi.fn(),
				getFallbackLang: vi.fn(),
				getCurrentLang: vi.fn().mockReturnValue('de'),
			};

			const dateAdapterMock = {setLocale: vi.fn()};

			vi.spyOn(console, 'warn');

			TestBed.configureTestingModule({
				providers: [
					{provide: DateAdapter, useValue: dateAdapterMock},
					{provide: TranslateService, useValue: mock},
					{provide: WINDOW, useValue: window},
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
		} as ObILocale;

		beforeEach(() => {
			const mock = {
				addLangs: vi.fn(),
				setFallbackLang: vi.fn(),
				use: vi.fn(),
				onLangChange: new Subject<{lang: string; translations: unknown}>(),
				getBrowserLang: vi.fn(),
				getFallbackLang: vi.fn(),
				getCurrentLang: vi.fn(),
			};

			TestBed.configureTestingModule({
				providers: [
					{provide: TranslateService, useValue: mock},
					{provide: WINDOW, useValue: window},
				],
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
		} as ObILocale;

		beforeEach(() => {
			localStorage.removeItem('oblique_lang');
			const mock = {
				addLangs: vi.fn(),
				setFallbackLang: vi.fn(),
				use: vi.fn(),
				onLangChange: new Subject<{lang: string; translations: unknown}>(),
				getBrowserLang: vi.fn().mockReturnValue('es'),
				getFallbackLang: vi.fn().mockReturnValue('pt'),
				getCurrentLang: vi.fn(),
			};

			TestBed.configureTestingModule({
				providers: [
					{provide: TranslateService, useValue: mock},
					{provide: WINDOW, useValue: window},
				],
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
