import {TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MAT_CHECKBOX_DEFAULT_OPTIONS} from '@angular/material/checkbox';
import {MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material/radio';
import {MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS} from '@angular/material/slide-toggle';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {
	TranslateCompiler,
	TranslateLoader,
	TranslateNoOpCompiler,
	TranslateNoOpLoader,
	TranslateService,
} from '@ngx-translate/core';
import {ObMultiTranslateLoader} from './multi-translate-loader/multi-translate-loader';
import {
	OB_ACCESSIBILITY_STATEMENT_CONFIGURATION,
	OB_HAS_LANGUAGE_IN_URL,
	OB_HISTORY_STATE,
	OB_TRANSLATION_CONFIGURATION,
	WINDOW,
	getLocalesConfiguration,
	getRootRoute,
	isNotKeyboardEventOnButton,
	mergeDeep,
	obFocusWithOutline,
	provideObliqueConfiguration,
	provideObliqueTestingConfiguration,
	provideObliqueTranslations,
	windowProvider,
} from './utilities';
import {MAT_TABS_CONFIG} from '@angular/material/tabs';
import {ObPaginatorService} from './paginator/ob-paginator.service';
import {ObIconService} from './icon/icon.service';
import {Observable, of} from 'rxjs';
import {ObLanguageService} from './language/language.service';
import {ObMasterLayoutConfig} from './master-layout/master-layout.config';
import {ObIAccessibilityStatementConfiguration, ObIObliqueConfiguration} from './utilities.model';

import {ObWindow} from './utilities.model';

const translations: any = {};
const accessibilityStatement: ObIAccessibilityStatementConfiguration = {
	applicationName: 'appName',
	createdOn: new Date('2025-01-31'),
	conformity: 'full',
	applicationOperator: 'Operator',
	contact: [{email: 'e@mail.com'}],
};
class FakeLoader implements TranslateLoader {
	// eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars
	getTranslation(_lang: string): Observable<any> {
		return of(translations);
	}
}

describe('utilities', () => {
	describe('windowProvider', () => {
		it('should return Window if provided with document', () => {
			const actualWindowProvider = windowProvider(document);
			expect(actualWindowProvider).toEqual(window);
		});

		describe('without window', () => {
			let win: ObWindow;

			beforeEach(() => {
				win = windowProvider({} as Document) as ObWindow;
			});

			it('should have a confirm function that returns a boolean', () => {
				expect(typeof win.confirm('')).toBe('boolean');
			});

			it('should have a history.length property', () => {
				expect(typeof win.history.length).toBe('number');
			});

			it('should have an innerHeight property', () => {
				expect(typeof win.innerHeight).toBe('number');
			});

			it('should have an innerWidth property', () => {
				expect(typeof win.innerWidth).toBe('number');
			});

			it('should have a localStorage.getItem function that returns a string', () => {
				expect(typeof win.localStorage.getItem('key')).toBe('string');
			});

			it('should have a localStorage.setItem function', () => {
				expect(() => win.localStorage.setItem('key', '')).not.toThrow();
			});

			it('should have a localStorage.removeItem function', () => {
				expect(() => win.localStorage.removeItem('key')).not.toThrow();
			});

			it('should have a location.href property', () => {
				expect(typeof win.location.href).toBe('string');
			});

			it('should have a location.host property', () => {
				expect(typeof win.location.host).toBe('string');
			});

			it('should have a matchMedia function that returns an object with a matches property', () => {
				expect(typeof win.matchMedia('(min-width: 600px)').matches).toBe('boolean');
			});

			it('should have an open function', () => {
				expect(() => win.open('https://example.com', '_blank')).not.toThrow();
			});

			it('should have a pageYOffset property', () => {
				expect(typeof win.pageYOffset).toBe('number');
			});

			it('should have a setTimeout function that returns a number', () => {
				expect(typeof win.setTimeout(() => {})).toBe('number');
			});

			it('should have a setInterval function that returns a number', () => {
				expect(typeof win.setInterval(() => {})).toBe('number');
			});
		});
	});

	describe('mergeDeep', () => {
		it('should return the override when the base is not a plain object', () => {
			const override = {value: 'override'};

			expect(mergeDeep(new Date('2025-01-31'), override as never)).toBe(override);
		});

		it('should return the override when the override is not a plain object', () => {
			const override = new Date('2025-01-31');

			expect(mergeDeep({value: 'base'}, override as never)).toBe(override);
		});

		it('should merge nested plain objects', () => {
			const baseConfig = {
				outer: {
					base: true,
					keep: 'value',
					override: false,
				},
			};
			const configOverride = {
				outer: {
					override: true,
				},
			};
			expect(mergeDeep(baseConfig, configOverride)).toEqual({
				outer: {
					base: true,
					keep: 'value',
					override: true,
				},
			});
		});
	});

	describe('provideObliqueConfiguration', () => {
		describe('with minimal required configuration', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
						{provide: ObLanguageService, useValue: {initialize: jest.fn()} as unknown as ObLanguageService},
						provideHttpClient(),
						provideObliqueConfiguration({accessibilityStatement}),
					],
				});
			});

			it('should initialize language and apply default providers', () => {
				const obLanguageService = TestBed.inject(ObLanguageService);
				const translationConfiguration = TestBed.inject(OB_TRANSLATION_CONFIGURATION);

				expect(obLanguageService.initialize).toHaveBeenCalled();
				expect(translationConfiguration).toEqual({flatten: true});
			});
		});

		describe('with default configuration', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
						{provide: ObLanguageService, useValue: {initialize: jest.fn()} as unknown as ObLanguageService},
						provideHttpClient(),
						provideObliqueConfiguration({
							accessibilityStatement: {
								applicationName: 'appName',
								createdOn: new Date('2025-01-31'),
								conformity: 'none',
								applicationOperator: 'Operator',
								contact: [{email: 'e@mail.com'}],
							},
						}),
					],
				});
			});

			it('should create WINDOW injection token', () => {
				const currentWindow = TestBed.inject(WINDOW);

				expect(currentWindow).toEqual(window);
			});

			describe('Paginator configuration', () => {
				it('should provide MatPaginatorIntl as ObPaginatorService', () => {
					const paginatorIntl = TestBed.inject(MatPaginatorIntl);

					expect(paginatorIntl instanceof ObPaginatorService).toBe(true);
				});
			});

			describe('Icon configuration', () => {
				it('should call "registerOnAppInit" on "ObIconService"', () => {
					const iconService = TestBed.inject(ObIconService);

					expect(iconService.registerOnAppInit).toHaveBeenCalledWith({registerObliqueIcons: true});
				});
			});

			describe('Language configuration', () => {
				it('should call "initialize" on "ObLanguageService"', () => {
					const languageService = TestBed.inject(ObLanguageService);

					expect(languageService.initialize).toHaveBeenCalled();
				});
			});

			describe('Translate configuration', () => {
				it('should provide "TranslateService"', () => {
					const translateService = TestBed.inject(TranslateService);

					expect(translateService).toBeTruthy();
				});

				it('should use "ObMultiTranslateLoader" as "TranslateLoader"', () => {
					const translateService = TestBed.inject(TranslateService);

					expect(translateService.currentLoader).toBeInstanceOf(ObMultiTranslateLoader);
				});

				it('should provide "OB_TRANSLATION_CONFIGURATION"', () => {
					const translationConfiguration = TestBed.inject(OB_TRANSLATION_CONFIGURATION);

					expect(translationConfiguration).toEqual({flatten: true});
				});
			});

			describe('Material configuration', () => {
				it.each([
					{token: MAT_FORM_FIELD_DEFAULT_OPTIONS, config: {appearance: 'outline'}},
					{token: STEPPER_GLOBAL_OPTIONS, config: {displayDefaultIndicatorType: false}},
					{token: MAT_CHECKBOX_DEFAULT_OPTIONS, config: {color: 'primary'}},
					{token: MAT_RADIO_DEFAULT_OPTIONS, config: {color: 'primary'}},
					{token: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, config: {color: 'primary'}},
					{token: MAT_TABS_CONFIG, config: {stretchTabs: false}},
				])('should create $token injection token', ({token, config}) => {
					const actualToken = TestBed.inject(token);
					expect(actualToken).toEqual(config);
				});
			});

			describe('accessibility statement configuration', () => {
				it('should provide OB_ACCESSIBILITY_STATEMENT_CONFIGURATION', () => {
					const actualAccessibilityStatement = TestBed.inject(OB_ACCESSIBILITY_STATEMENT_CONFIGURATION);
					expect(actualAccessibilityStatement).toEqual({
						applicationName: 'appName',
						createdOn: new Date('2025-01-31'),
						conformity: 'none',
						applicationOperator: 'Operator',
						contact: [{email: 'e@mail.com'}],
					});
				});
			});

			describe('has language in URL', () => {
				it('should provide OB_HAS_LANGUAGE_IN_URL as false', () => {
					const hasLanguageInUrl = TestBed.inject(OB_HAS_LANGUAGE_IN_URL);

					expect(hasLanguageInUrl).toBe(false);
				});
			});

			describe('history state', () => {
				it('should capture the initial browser history length', () => {
					const historyState = TestBed.inject(OB_HISTORY_STATE);

					expect(historyState).toEqual({initialLength: window.history.length});
				});
			});
		});

		describe('with custom configuration', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
						{provide: TranslateLoader, useClass: FakeLoader},
						provideHttpClient(),
						provideObliqueConfiguration({
							accessibilityStatement: {
								applicationName: 'appName',
								createdOn: new Date('2025-01-31'),
								conformity: 'none',
								applicationOperator: 'Operator',
								contact: [{email: 'e@mail.com'}],
							},
							material: {
								MAT_FORM_FIELD_DEFAULT_OPTIONS: {floatLabel: 'always'},
								STEPPER_GLOBAL_OPTIONS: {showError: true},
								MAT_CHECKBOX_OPTIONS: {clickAction: 'check'},
								MAT_RADIO_OPTIONS: {color: 'accent'},
								MAT_SLIDE_TOGGLE_OPTIONS: {hideIcon: true},
								MAT_TABS_CONFIG: {fitInkBarToContent: true},
							},
							icon: {
								additionalIcons: [],
							},
							translate: {
								flatten: false,
								config: {compiler: TranslateNoOpCompiler},
								additionalFiles: [{prefix: 'prefix', suffix: 'suffix'}],
							},
							hasLanguageInUrl: true,
						}),
					],
				});
			});

			it('should create WINDOW injection token', () => {
				const actualWindow = TestBed.inject(WINDOW);
				expect(actualWindow).toEqual(window);
			});

			describe('Icon configuration', () => {
				it('should call "registerOnAppInit" on "ObIconService"', () => {
					const obIconService = TestBed.inject(ObIconService);

					expect(obIconService.registerOnAppInit).toHaveBeenCalledWith({
						registerObliqueIcons: true,
						additionalIcons: [],
					});
				});
			});

			describe('Translate configuration', () => {
				it('should provide "OB_TRANSLATION_CONFIGURATION"', () => {
					const translationConfiguration = TestBed.inject(OB_TRANSLATION_CONFIGURATION);

					expect(translationConfiguration).toEqual({
						additionalFiles: [{prefix: 'prefix', suffix: 'suffix'}],
						flatten: false,
					});
				});

				it('should use "TranslateNoOpCompiler " as "TranslateCompiler"', () => {
					const translateService = TestBed.inject(TranslateService);
					expect(translateService.compiler).toBeInstanceOf(TranslateNoOpCompiler);
				});
			});

			describe('Material configuration', () => {
				it.each([
					{token: MAT_FORM_FIELD_DEFAULT_OPTIONS, config: {appearance: 'outline', floatLabel: 'always'}},
					{token: STEPPER_GLOBAL_OPTIONS, config: {displayDefaultIndicatorType: false, showError: true}},
					{token: MAT_CHECKBOX_DEFAULT_OPTIONS, config: {color: 'primary', clickAction: 'check'}},
					{token: MAT_RADIO_DEFAULT_OPTIONS, config: {color: 'accent'}},
					{token: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, config: {color: 'primary', hideIcon: true}},
					{token: MAT_TABS_CONFIG, config: {stretchTabs: false, fitInkBarToContent: true}},
				])('should create $token injection token', ({token, config}) => {
					expect(TestBed.inject(token)).toEqual(config);
				});
			});

			describe('accessibility statement configuration', () => {
				it('should provide OB_ACCESSIBILITY_STATEMENT_CONFIGURATION', () => {
					expect(TestBed.inject(OB_ACCESSIBILITY_STATEMENT_CONFIGURATION)).toEqual({
						applicationName: 'appName',
						createdOn: new Date('2025-01-31'),
						conformity: 'none',
						applicationOperator: 'Operator',
						contact: [{email: 'e@mail.com'}],
					});
				});
			});

			describe('has language in URL', () => {
				it('should provide OB_HAS_LANGUAGE_IN_URL as true', () => {
					const hasLanguageInUrl = TestBed.inject(OB_HAS_LANGUAGE_IN_URL);

					expect(hasLanguageInUrl).toBe(true);
				});
			});

			describe('history state', () => {
				it('should capture the initial browser history length', () => {
					const historyState = TestBed.inject(OB_HISTORY_STATE);

					expect(historyState).toEqual({initialLength: window.history.length});
				});
			});
		});

		describe('with locales provided through translate configuration', () => {
			const locales = {
				locales: ['de-CH', 'fr-CH', 'it-CH'],
				defaultLanguage: 'de',
				disabled: false,
				languages: {de: 'Deutsch', fr: 'Francais', it: 'Italiano'},
			};

			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
						{provide: ObLanguageService, useValue: {initialize: jest.fn()} as unknown as ObLanguageService},
						provideHttpClient(),
						provideObliqueConfiguration({
							accessibilityStatement: {
								applicationName: 'appName',
								createdOn: new Date('2025-01-31'),
								conformity: 'none',
								applicationOperator: 'Operator',
								contact: [{email: 'e@mail.com'}],
							},
							translate: {locales},
						}),
					],
				});
			});

			it('should initialize language with locales from translate configuration', () => {
				const obLanguageService = TestBed.inject(ObLanguageService);

				expect(obLanguageService.initialize).toHaveBeenCalledWith(locales);
			});
		});

		describe('with override-only configuration', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
						{provide: ObLanguageService, useValue: {initialize: jest.fn()} as unknown as ObLanguageService},
						provideHttpClient(),
						provideObliqueConfiguration({
							accessibilityStatement,
							translate: {flatten: false},
						}),
					],
				});
			});

			it('should keep provided accessibility statement while overriding translation options', () => {
				const accessibilityStatementConfiguration = TestBed.inject(OB_ACCESSIBILITY_STATEMENT_CONFIGURATION);
				const translationConfiguration = TestBed.inject(OB_TRANSLATION_CONFIGURATION);

				expect(accessibilityStatementConfiguration).toEqual(accessibilityStatement);
				expect(translationConfiguration).toEqual({flatten: false});
			});
		});

		describe('with partial material override', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
						{provide: ObLanguageService, useValue: {initialize: jest.fn()} as unknown as ObLanguageService},
						provideHttpClient(),
						provideObliqueConfiguration({
							accessibilityStatement,
							material: {
								MAT_FORM_FIELD_DEFAULT_OPTIONS: {floatLabel: 'always'},
							},
						}),
					],
				});
			});

			it('should merge overridden material option with defaults and keep untouched defaults', () => {
				const matFormFieldDefaults = TestBed.inject(MAT_FORM_FIELD_DEFAULT_OPTIONS);
				const matCheckboxDefaults = TestBed.inject(MAT_CHECKBOX_DEFAULT_OPTIONS);

				expect(matFormFieldDefaults).toEqual({appearance: 'outline', floatLabel: 'always'});
				expect(matCheckboxDefaults).toEqual({color: 'primary'});
			});
		});

		describe('with explicit undefined in nested material override', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
						{provide: ObLanguageService, useValue: {initialize: jest.fn()} as unknown as ObLanguageService},
						provideHttpClient(),
						provideObliqueConfiguration({
							accessibilityStatement,
							material: {
								MAT_FORM_FIELD_DEFAULT_OPTIONS: {
									appearance: undefined,
									floatLabel: 'always',
								},
							},
						}),
					],
				});
			});

			it('should ignore undefined nested overrides and keep default values', () => {
				const matFormFieldDefaults = TestBed.inject(MAT_FORM_FIELD_DEFAULT_OPTIONS);
				expect(matFormFieldDefaults).toEqual({appearance: 'outline', floatLabel: 'always'});
			});
		});

		describe('with a non-plain configuration object', () => {
			beforeEach(() => {
				class NonPlainConfig {
					accessibilityStatement = accessibilityStatement;
					material = {
						MAT_FORM_FIELD_DEFAULT_OPTIONS: {floatLabel: 'always'},
					};
				}

				TestBed.configureTestingModule({
					providers: [
						{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
						{provide: ObLanguageService, useValue: {initialize: jest.fn()} as unknown as ObLanguageService},
						provideHttpClient(),
						provideObliqueConfiguration(
							new NonPlainConfig() as unknown as Parameters<typeof provideObliqueConfiguration>[0]
						),
					],
				});
			});

			it('should still apply nested material overrides', () => {
				const matFormFieldDefaults = TestBed.inject(MAT_FORM_FIELD_DEFAULT_OPTIONS);
				expect(matFormFieldDefaults).toEqual({appearance: 'outline', floatLabel: 'always'});
			});
		});

		describe('with a null-prototype configuration object', () => {
			beforeEach(() => {
				const config = Object.assign(Object.create(null), {
					accessibilityStatement,
					material: {
						MAT_FORM_FIELD_DEFAULT_OPTIONS: {floatLabel: 'always'},
					},
				}) as ObIObliqueConfiguration;

				TestBed.configureTestingModule({
					providers: [
						{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
						{provide: ObLanguageService, useValue: {initialize: jest.fn()} as unknown as ObLanguageService},
						provideHttpClient(),
						provideObliqueConfiguration(config),
					],
				});
			});

			it('should merge defaults with null-prototype config objects', () => {
				expect(TestBed.inject(MAT_FORM_FIELD_DEFAULT_OPTIONS)).toEqual({appearance: 'outline', floatLabel: 'always'});
			});
		});

		describe('with partial translate override', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
						{provide: ObLanguageService, useValue: {initialize: jest.fn()} as unknown as ObLanguageService},
						provideHttpClient(),
						provideObliqueConfiguration({
							accessibilityStatement,
							translate: {
								config: {compiler: TranslateNoOpCompiler},
							},
						}),
					],
				});
			});

			it('should keep translate defaults while overriding provided options', () => {
				const translationConfiguration = TestBed.inject(OB_TRANSLATION_CONFIGURATION);

				expect(translationConfiguration).toEqual({flatten: true});
				expect(TestBed.inject(TranslateService).compiler).toBeInstanceOf(TranslateNoOpCompiler);
			});
		});

		describe('with multiple-level partial override', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
						{provide: ObLanguageService, useValue: {initialize: jest.fn()} as unknown as ObLanguageService},
						provideHttpClient(),
						provideObliqueConfiguration({
							accessibilityStatement,
							material: {
								MAT_TABS_CONFIG: {fitInkBarToContent: true},
							},
							translate: {
								config: {
									loader: {provide: TranslateLoader, useClass: TranslateNoOpLoader},
								},
							},
						}),
					],
				});
			});

			it('should keep defaults while applying deep partial overrides', () => {
				expect(TestBed.inject(MAT_TABS_CONFIG)).toEqual({stretchTabs: false, fitInkBarToContent: true});
				const translationConfiguration = TestBed.inject(OB_TRANSLATION_CONFIGURATION);

				expect(translationConfiguration).toEqual({flatten: true});
				expect(TestBed.inject(TranslateService).currentLoader).toBeInstanceOf(TranslateNoOpLoader);
			});
		});

		describe('with missing locales in both configuration and ObMasterLayoutConfig', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
						{provide: ObMasterLayoutConfig, useValue: {}},
						provideHttpClient(),
						provideObliqueConfiguration({
							accessibilityStatement: {
								applicationName: 'appName',
								createdOn: new Date('2025-01-31'),
								conformity: 'none',
								applicationOperator: 'Operator',
								contact: [{email: 'e@mail.com'}],
							},
						}),
					],
				});
			});

			it('should throw', () => {
				expect(() => TestBed.inject(WINDOW)).toThrow();
			});
		});

		describe('with missing locales and null ObMasterLayoutConfig', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
						{provide: ObMasterLayoutConfig, useValue: null},
						provideHttpClient(),
						provideObliqueConfiguration({
							accessibilityStatement: {
								applicationName: 'appName',
								createdOn: new Date('2025-01-31'),
								conformity: 'none',
								applicationOperator: 'Operator',
								contact: [{email: 'e@mail.com'}],
							},
						}),
					],
				});
			});

			it('should throw', () => {
				expect(() => TestBed.inject(WINDOW)).toThrow();
			});
		});
	});

	describe('provideObliqueTranslations', () => {
		describe('with locale fallback from ObMasterLayoutConfig through provideObliqueConfiguration', () => {
			const locale = {
				locales: ['de-CH', 'fr-CH', 'it-CH'],
				defaultLanguage: 'de',
				disabled: false,
				languages: {de: 'Deutsch', fr: 'Francais', it: 'Italiano'},
			};

			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
						{provide: ObLanguageService, useValue: {initialize: jest.fn()} as unknown as ObLanguageService},
						{provide: ObMasterLayoutConfig, useValue: {locale}},
						provideHttpClient(),
						provideObliqueConfiguration({
							accessibilityStatement: {
								applicationName: 'appName',
								createdOn: new Date('2025-01-31'),
								conformity: 'none',
								applicationOperator: 'Operator',
								contact: [{email: 'e@mail.com'}],
							},
						}),
					],
				});
			});

			it('should initialize language with locale from ObMasterLayoutConfig when translate.locales is not provided', () => {
				const obLanguageService = TestBed.inject(ObLanguageService);
				expect(obLanguageService.initialize).toHaveBeenCalledWith(locale);
			});
		});

		describe('with default configuration', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [provideHttpClient(), provideObliqueTranslations()],
				});
			});

			it('should provide "TranslateService"', () => {
				const translateService = TestBed.inject(TranslateService);
				expect(translateService).toBeTruthy();
			});

			it('should use "ObMultiTranslateLoader" as "TranslateLoader"', () => {
				const translateService = TestBed.inject(TranslateService);
				expect(translateService.currentLoader).toBeInstanceOf(ObMultiTranslateLoader);
			});

			it('should provide "TRANSLATION_FILES"', () => {
				const translationConfiguration = TestBed.inject(OB_TRANSLATION_CONFIGURATION);

				expect(translationConfiguration).toEqual({additionalFiles: undefined, flatten: true});
			});

			describe('loader', () => {
				it('should be an instance of "ObMultiTranslateLoader"', () => {
					const translateLoader = TestBed.inject(TranslateLoader);
					expect(translateLoader).toBeInstanceOf(ObMultiTranslateLoader);
				});
			});

			describe('getTranslation', () => {
				let httpClient: HttpClient;
				beforeEach(() => {
					httpClient = TestBed.inject(HttpClient);
					jest.spyOn(httpClient, 'get');
					TestBed.inject(TranslateLoader).getTranslation('en');
				});

				afterEach(() => {
					jest.clearAllMocks();
				});

				it(`should do 2 http calls`, () => {
					expect(httpClient.get).toHaveBeenCalledTimes(2);
				});

				it.each([
					{index: 1, url: './assets/i18n/oblique-en.json'},
					{index: 2, url: './assets/i18n/en.json'},
				])('should request $url on $index call', ({index, url}) => {
					expect(httpClient.get).toHaveBeenNthCalledWith(index, url);
				});
			});
		});

		describe('with a custom configuration containing "additionalFiles"', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						provideHttpClient(),
						provideObliqueTranslations({
							flatten: false,
							additionalFiles: [
								{prefix: './path1/', suffix: '.json'},
								{prefix: './path2/', suffix: '.js'},
							],
						}),
					],
				});
			});

			it('should provide "OB_TRANSLATION_CONFIGURATION"', () => {
				const translationConfiguration = TestBed.inject(OB_TRANSLATION_CONFIGURATION);

				expect(translationConfiguration).toEqual({
					additionalFiles: [
						{prefix: './path1/', suffix: '.json'},
						{prefix: './path2/', suffix: '.js'},
					],
					flatten: false,
				});
			});

			it('should use "TranslateNoOpCompiler " as "TranslateCompiler"', () => {
				const translateService = TestBed.inject(TranslateService);
				expect(translateService.compiler).toBeInstanceOf(TranslateNoOpCompiler);
			});

			describe('loader', () => {
				it('should be an instance of "ObMultiTranslateLoader"', () => {
					const translateLoader = TestBed.inject(TranslateLoader);
					expect(translateLoader).toBeInstanceOf(ObMultiTranslateLoader);
				});
			});

			describe('getTranslation', () => {
				let httpClient: HttpClient;
				beforeEach(() => {
					httpClient = TestBed.inject(HttpClient);
					jest.spyOn(httpClient, 'get');
					TestBed.inject(TranslateLoader).getTranslation('en');
				});

				afterEach(() => {
					jest.clearAllMocks();
				});

				it(`should do 3 http calls`, () => {
					expect(httpClient.get).toHaveBeenCalledTimes(3);
				});

				it.each([
					{index: 1, url: './assets/i18n/oblique-en.json'},
					{index: 2, url: './path1/en.json'},
					{index: 3, url: './path2/en.js'},
				])('should request $url on $index call', ({index, url}) => {
					expect(httpClient.get).toHaveBeenNthCalledWith(index, url);
				});
			});
		});

		describe('with a custom configuration containing a config with its own loader', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						{provide: TranslateCompiler, useClass: TranslateNoOpCompiler},
						provideHttpClient(),
						provideObliqueTranslations({
							flatten: false,
							config: {loader: {provide: TranslateLoader, useClass: TranslateNoOpLoader}},
						}),
					],
				});
			});

			it('should provide "OB_TRANSLATION_CONFIGURATION"', () => {
				const translationConfiguration = TestBed.inject(OB_TRANSLATION_CONFIGURATION);

				expect(translationConfiguration).toEqual({
					flatten: false,
				});
			});

			it('should use "TranslateNoOpCompiler " as "TranslateLoader"', () => {
				const translateService = TestBed.inject(TranslateService);
				expect(translateService.compiler instanceof TranslateNoOpCompiler).toBe(true);
			});

			describe('loader', () => {
				it('should be an instance of "TranslateNoOpLoader "', () => {
					const translateLoader = TestBed.inject(TranslateLoader);
					expect(translateLoader instanceof TranslateNoOpLoader).toBe(true);
				});
			});

			describe('getTranslation', () => {
				let httpClient: HttpClient;
				beforeEach(() => {
					httpClient = TestBed.inject(HttpClient);
					jest.spyOn(httpClient, 'get');
					TestBed.inject(TranslateLoader).getTranslation('en');
				});

				afterEach(() => {
					jest.clearAllMocks();
				});

				it(`should do 0 http calls`, () => {
					expect(httpClient.get).toHaveBeenCalledTimes(0);
				});
			});
		});
	});

	describe('provideObliqueTestingConfiguration', () => {
		const localeFromTranslate = {
			locales: ['de-CH', 'fr-CH', 'it-CH'],
			defaultLanguage: 'de',
			disabled: false,
			languages: {de: 'Deutsch', fr: 'Francais', it: 'Italiano'},
		};
		const localeFromMasterLayout = {
			locales: ['en-CH', 'de-CH'],
			defaultLanguage: 'en',
			disabled: false,
			languages: {en: 'English', de: 'Deutsch'},
		};

		it('should initialize language with locales from translate configuration when provided', () => {
			TestBed.configureTestingModule({
				providers: [
					{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
					{provide: ObLanguageService, useValue: {initialize: jest.fn()} as unknown as ObLanguageService},
					{provide: ObMasterLayoutConfig, useValue: {locale: localeFromMasterLayout}},
					provideHttpClient(),
					provideObliqueTestingConfiguration({
						translate: {locales: localeFromTranslate},
					}),
				],
			});

			const obLanguageService = TestBed.inject(ObLanguageService);
			expect(obLanguageService.initialize).toHaveBeenCalledWith(localeFromTranslate);
		});

		it('should initialize language with locale from ObMasterLayoutConfig when translate locales are not provided', () => {
			TestBed.configureTestingModule({
				providers: [
					{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
					{provide: ObLanguageService, useValue: {initialize: jest.fn()} as unknown as ObLanguageService},
					{provide: ObMasterLayoutConfig, useValue: {locale: localeFromMasterLayout}},
					provideHttpClient(),
					provideObliqueTestingConfiguration(),
				],
			});

			expect(TestBed.inject(ObLanguageService).initialize).toHaveBeenCalledWith(localeFromMasterLayout);
		});

		it('should initialize language with locale from ObMasterLayoutConfig when translate is provided without locales', () => {
			TestBed.configureTestingModule({
				providers: [
					{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
					{provide: ObLanguageService, useValue: {initialize: jest.fn()} as unknown as ObLanguageService},
					{provide: ObMasterLayoutConfig, useValue: {locale: localeFromMasterLayout}},
					provideHttpClient(),
					provideObliqueTestingConfiguration({
						translate: {flatten: true},
					}),
				],
			});

			expect(TestBed.inject(ObLanguageService).initialize).toHaveBeenCalledWith(localeFromMasterLayout);
		});

		it('should provide a translate loader returning empty translations', done => {
			TestBed.configureTestingModule({
				providers: [
					{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
					{provide: ObLanguageService, useValue: {initialize: jest.fn()} as unknown as ObLanguageService},
					{provide: ObMasterLayoutConfig, useValue: {locale: localeFromMasterLayout}},
					provideHttpClient(),
					provideObliqueTestingConfiguration(),
				],
			});

			TestBed.inject(TranslateService)
				.currentLoader.getTranslation('de')
				.subscribe(value => {
					expect(value).toEqual({});
					done();
				});
		});
	});

	describe('getLocalesConfiguration', () => {
		const localeFromMasterLayout = {
			locales: ['en-CH', 'de-CH'],
			defaultLanguage: 'en',
			disabled: false,
			languages: {en: 'English', de: 'Deutsch'},
		};

		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [{provide: ObMasterLayoutConfig, useValue: {locale: localeFromMasterLayout}}],
			});
		});

		it('should return translate locales when they are provided', () => {
			const localeFromTranslate = {
				locales: ['de-CH', 'fr-CH', 'it-CH'],
				defaultLanguage: 'de',
				disabled: false,
				languages: {de: 'Deutsch', fr: 'Francais', it: 'Italiano'},
			};

			const locales = TestBed.runInInjectionContext(() =>
				getLocalesConfiguration({
					translate: {locales: localeFromTranslate},
				} as ObIObliqueConfiguration)
			);

			expect(locales).toEqual(localeFromTranslate);
		});

		it('should fall back to ObMasterLayoutConfig locale when translate is undefined', () => {
			const locales = TestBed.runInInjectionContext(() =>
				getLocalesConfiguration({
					translate: undefined,
				} as ObIObliqueConfiguration)
			);

			expect(locales).toEqual(localeFromMasterLayout);
		});
	});

	describe('isNotKeyboardEventOnButton', () => {
		it('should return true if no event is provided', () => {
			expect(isNotKeyboardEventOnButton(null)).toBe(true);
		});

		it('should return true if a MouseEvent is provided', () => {
			expect(isNotKeyboardEventOnButton(new MouseEvent('click'))).toBe(true);
		});

		describe('keyboard event', () => {
			let event: KeyboardEvent;
			beforeEach(() => {
				event = new KeyboardEvent('keyup');
			});

			it('should return true if a target is not a button', () => {
				Object.defineProperty(event, 'target', {value: {nodeName: 'DIV'}});
				expect(isNotKeyboardEventOnButton(event)).toBe(true);
			});

			it('should return false if target is a button', () => {
				Object.defineProperty(event, 'target', {value: {nodeName: 'BUTTON'}});
				expect(isNotKeyboardEventOnButton(event)).toBe(false);
			});
		});
	});

	describe('getRootRoute', () => {
		it("should return the route's first child", () => {
			const route = {firstChild: {outlet: 'root'}} as ActivatedRoute;
			expect(getRootRoute(route)).toEqual({outlet: 'root'});
		});

		it('should return the route itself when there is no firstChild', () => {
			const route = {outlet: 'childLessRoot'} as ActivatedRoute;
			expect(getRootRoute(route)).toEqual({outlet: 'childLessRoot'});
		});
	});

	describe('obFocusWithOutline', () => {
		it('should set the focus on the HTML input element', () => {
			const htmlInputElement = document.createElement('input');
			document.body.appendChild(htmlInputElement);
			obFocusWithOutline(document, htmlInputElement);
			expect(document.activeElement).toBe(htmlInputElement);
		});
	});
});
