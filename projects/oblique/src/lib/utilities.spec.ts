import {TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MAT_CHECKBOX_DEFAULT_OPTIONS} from '@angular/material/checkbox';
import {MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material/radio';
import {MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS} from '@angular/material/slide-toggle';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {TranslateCompiler, TranslateFakeCompiler, TranslateFakeLoader, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';
import {OB_FLATTEN_TRANSLATION_FILES, ObMultiTranslateLoader, TRANSLATION_FILES} from './multi-translate-loader/multi-translate-loader';
import {
	OB_ACCESSIBILITY_STATEMENT_CONFIGURATION,
	OB_HAS_LANGUAGE_IN_URL,
	WINDOW,
	getRootRoute,
	getTranslateLoader,
	isNotKeyboardEventOnButton,
	obFocusWithOutline,
	provideObliqueConfiguration,
	provideObliqueTranslations,
	windowProvider
} from './utilities';
import {MAT_TABS_CONFIG} from '@angular/material/tabs';
import {ObPaginatorService} from './paginator/ob-paginator.service';
import {ObTIconConfig} from './icon/icon.model';
import {ObIconService} from './icon/icon.service';

describe('utilities', () => {
	describe('windowProvider', () => {
		it('should return Window if provided with document', () => {
			expect(windowProvider(document)).toEqual(window);
		});

		it('should return en empty object if not provided document', () => {
			expect(windowProvider({} as Document)).toEqual({});
		});
	});

	describe('getTranslateLoader', () => {
		const httpClient = {get: () => of({})} as unknown as HttpClient;

		describe.each([
			[
				undefined,
				[
					['Oblique', 1, './assets/i18n/oblique-en.json'],
					['Project', 2, './assets/i18n/en.json']
				]
			],
			[[], [['Oblique', 1, './assets/i18n/oblique-en.json']]],
			[
				[
					{prefix: './module1-', suffix: '.json'},
					{prefix: './module2-', suffix: '.json'}
				],
				[
					['Oblique', 1, './assets/i18n/oblique-en.json'],
					['Module 1', 2, './module1-en.json'],
					['Module 2', 3, './module2-en.json']
				]
			]
		])('with %s as additional files', (files, httpCalls) => {
			const object = getTranslateLoader(httpClient, files, true);

			it('should create an object', () => {
				expect(object).toBeTruthy();
			});

			it('should create an ObMultiTranslateLoader object', () => {
				expect(object instanceof ObMultiTranslateLoader).toBe(true);
			});

			describe('getTranslation', () => {
				beforeEach(() => {
					jest.spyOn(httpClient, 'get');
					object.getTranslation('en');
				});

				afterEach(() => {
					jest.clearAllMocks();
				});

				it(`should do ${httpCalls.length} http calls`, () => {
					expect(httpClient.get).toHaveBeenCalledTimes(httpCalls.length);
				});

				it.each(httpCalls)('should request %s translations', (name, index, httpCall) => {
					expect(httpClient.get).toHaveBeenNthCalledWith(index as number, httpCall);
				});
			});
		});
	});

	describe('provideObliqueConfiguration', () => {
		describe('with default configuration', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
						provideHttpClient(),
						provideObliqueConfiguration({
							accessibilityStatement: {
								applicationName: 'appName',
								createdOn: new Date('2025-01-31'),
								conformity: 'none',
								applicationOperator: 'Operator',
								contact: {emails: ['e@mail.com']}
							}
						})
					]
				});
			});

			it('should create WINDOW injection token', () => {
				expect(TestBed.inject(WINDOW)).toEqual(window);
			});

			describe('Paginator configuration', () => {
				it('should provide MatPaginatorIntl as ObPaginatorService', () => {
					expect(TestBed.inject(MatPaginatorIntl) instanceof ObPaginatorService).toBe(true);
				});
			});

			describe('Icon configuration', () => {
				it('should provide the default icon configuration', () => {
					expect(TestBed.inject(ObTIconConfig)).toEqual({registerObliqueIcons: true});
				});

				it('should call "registerOnAppInit" on "ObIconService"', () => {
					expect(TestBed.inject(ObIconService).registerOnAppInit).toHaveBeenCalled();
				});
			});

			describe('Translate configuration', () => {
				it('should provide "TranslateService"', () => {
					expect(TestBed.inject(TranslateService)).toBeTruthy();
				});

				it('should use "ObMultiTranslateLoader" as "TranslateLoader"', () => {
					expect(TestBed.inject(TranslateService).currentLoader instanceof ObMultiTranslateLoader).toBe(true);
				});

				it('should provide "TRANSLATION_FILES"', () => {
					expect(TestBed.inject(TRANSLATION_FILES)).toBeUndefined();
				});

				it('should provide "OB_FLATTEN_TRANSLATION_FILES"', () => {
					expect(TestBed.inject(OB_FLATTEN_TRANSLATION_FILES)).toBe(true);
				});
			});

			describe('Material configuration', () => {
				it.each([
					{token: MAT_FORM_FIELD_DEFAULT_OPTIONS, config: {appearance: 'outline'}},
					{token: STEPPER_GLOBAL_OPTIONS, config: {displayDefaultIndicatorType: false}},
					{token: MAT_CHECKBOX_DEFAULT_OPTIONS, config: {color: 'primary'}},
					{token: MAT_RADIO_DEFAULT_OPTIONS, config: {color: 'primary'}},
					{token: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, config: {color: 'primary'}},
					{token: MAT_TABS_CONFIG, config: {stretchTabs: false}}
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
						contact: {emails: ['e@mail.com']}
					});
				});
			});

			describe('has language in URL', () => {
				it('should provide OB_HAS_LANGUAGE_IN_URL as false', () => {
					expect(TestBed.inject(OB_HAS_LANGUAGE_IN_URL)).toBe(false);
				});
			});
		});

		describe('with custom configuration', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						{provide: ObIconService, useValue: {registerOnAppInit: jest.fn()} as unknown as ObIconService},
						{provide: TranslateCompiler, useClass: TranslateFakeCompiler},
						provideHttpClient(),
						provideObliqueConfiguration({
							accessibilityStatement: {
								applicationName: 'appName',
								createdOn: new Date('2025-01-31'),
								conformity: 'none',
								applicationOperator: 'Operator',
								contact: {emails: ['e@mail.com']}
							},
							material: {
								MAT_FORM_FIELD_DEFAULT_OPTIONS: {floatLabel: 'always'},
								STEPPER_GLOBAL_OPTIONS: {showError: true},
								MAT_CHECKBOX_OPTIONS: {clickAction: 'check'},
								MAT_RADIO_OPTIONS: {color: 'accent'},
								MAT_SLIDE_TOGGLE_OPTIONS: {hideIcon: true},
								MAT_TABS_CONFIG: {fitInkBarToContent: true}
							},
							icon: {
								additionalIcons: []
							},
							translate: {
								flatten: false,
								config: {compiler: TranslateFakeCompiler},
								additionalFiles: [{prefix: 'prefix', suffix: 'suffix'}]
							},
							hasLanguageInUrl: true
						})
					]
				});
			});

			it('should create WINDOW injection token', () => {
				expect(TestBed.inject(WINDOW)).toEqual(window);
			});

			describe('Icon configuration', () => {
				it('should provide the full icon configuration', () => {
					expect(TestBed.inject(ObTIconConfig)).toEqual({registerObliqueIcons: true, additionalIcons: []});
				});
			});

			describe('Translate configuration', () => {
				it('should provide "TRANSLATION_FILES"', () => {
					expect(TestBed.inject(TRANSLATION_FILES)).toEqual([{prefix: 'prefix', suffix: 'suffix'}]);
				});

				it('should provide "OB_FLATTEN_TRANSLATION_FILES"', () => {
					expect(TestBed.inject(OB_FLATTEN_TRANSLATION_FILES)).toEqual(false);
				});

				it('should use "ObMultiTranslateLoader" as "TranslateLoader"', () => {
					expect(TestBed.inject(TranslateService).compiler instanceof TranslateFakeCompiler).toBe(true);
				});
			});

			describe('Material configuration', () => {
				it.each([
					{token: MAT_FORM_FIELD_DEFAULT_OPTIONS, config: {appearance: 'outline', floatLabel: 'always'}},
					{token: STEPPER_GLOBAL_OPTIONS, config: {displayDefaultIndicatorType: false, showError: true}},
					{token: MAT_CHECKBOX_DEFAULT_OPTIONS, config: {color: 'primary', clickAction: 'check'}},
					{token: MAT_RADIO_DEFAULT_OPTIONS, config: {color: 'accent'}},
					{token: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, config: {color: 'primary', hideIcon: true}},
					{token: MAT_TABS_CONFIG, config: {stretchTabs: false, fitInkBarToContent: true}}
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
						contact: {emails: ['e@mail.com']}
					});
				});
			});

			describe('has language in URL', () => {
				it('should provide OB_HAS_LANGUAGE_IN_URL as true', () => {
					expect(TestBed.inject(OB_HAS_LANGUAGE_IN_URL)).toBe(true);
				});
			});
		});

		describe('with token configuration for Translate', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						provideHttpClient(),
						provideObliqueConfiguration({
							accessibilityStatement: {
								applicationName: 'appName',
								createdOn: new Date('2025-01-31'),
								conformity: 'none',
								applicationOperator: 'Operator',
								contact: {emails: ['e@mail.com']}
							}
						}),
						{provide: TRANSLATION_FILES, useValue: [{prefix: 'prefix', suffix: 'suffix'}]},
						{provide: OB_FLATTEN_TRANSLATION_FILES, useValue: true}
					]
				});
			});

			it('should create WINDOW injection token', () => {
				expect(TestBed.inject(WINDOW)).toEqual(window);
			});

			it('should provide "TRANSLATION_FILES"', () => {
				expect(TestBed.inject(TRANSLATION_FILES)).toEqual([{prefix: 'prefix', suffix: 'suffix'}]);
			});

			it('should provide "OB_FLATTEN_TRANSLATION_FILES"', () => {
				expect(TestBed.inject(OB_FLATTEN_TRANSLATION_FILES)).toEqual(true);
			});
		});
	});

	describe('provideObliqueTranslations', () => {
		describe('with default configuration', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [provideHttpClient(), provideObliqueTranslations()]
				});
			});

			it('should provide "TranslateService"', () => {
				expect(TestBed.inject(TranslateService)).toBeTruthy();
			});

			it('should use "ObMultiTranslateLoader" as "TranslateLoader"', () => {
				expect(TestBed.inject(TranslateService).currentLoader instanceof ObMultiTranslateLoader).toBe(true);
			});

			it('should provide "TRANSLATION_FILES"', () => {
				expect(TestBed.inject(TRANSLATION_FILES)).toBeUndefined();
			});

			it('should provide "OB_FLATTEN_TRANSLATION_FILES"', () => {
				expect(TestBed.inject(OB_FLATTEN_TRANSLATION_FILES)).toBe(true);
			});

			describe('loader', () => {
				it('should be an instance of ObMultiTranslateLoader', () => {
					expect(TestBed.inject(TranslateLoader) instanceof ObMultiTranslateLoader).toBe(true);
				});
			});
		});

		describe('with custom configuration', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						{provide: TranslateCompiler, useClass: TranslateFakeCompiler},
						provideHttpClient(),
						provideObliqueTranslations({
							flatten: false,
							config: {loader: TranslateFakeLoader},
							additionalFiles: [{prefix: 'prefix', suffix: 'suffix'}]
						})
					]
				});
			});

			it('should provide "TRANSLATION_FILES"', () => {
				expect(TestBed.inject(TRANSLATION_FILES)).toEqual([{prefix: 'prefix', suffix: 'suffix'}]);
			});

			it('should provide "OB_FLATTEN_TRANSLATION_FILES"', () => {
				expect(TestBed.inject(OB_FLATTEN_TRANSLATION_FILES)).toEqual(false);
			});

			it('should use "ObMultiTranslateLoader" as "TranslateLoader"', () => {
				expect(TestBed.inject(TranslateService).compiler instanceof TranslateFakeCompiler).toBe(true);
			});

			describe('loader', () => {
				it('should be an instance of ObMultiTranslateLoader', () => {
					expect(TestBed.inject(TranslateLoader) instanceof ObMultiTranslateLoader).toBe(true);
				});
			});
		});

		describe('with token configuration for Translate', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						provideObliqueTranslations(),
						{provide: TRANSLATION_FILES, useValue: [{prefix: 'prefix', suffix: 'suffix'}]},
						{provide: OB_FLATTEN_TRANSLATION_FILES, useValue: true}
					]
				});
			});

			it('should provide "TRANSLATION_FILES"', () => {
				expect(TestBed.inject(TRANSLATION_FILES)).toEqual([{prefix: 'prefix', suffix: 'suffix'}]);
			});

			it('should provide "OB_FLATTEN_TRANSLATION_FILES"', () => {
				expect(TestBed.inject(OB_FLATTEN_TRANSLATION_FILES)).toEqual(true);
			});
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
