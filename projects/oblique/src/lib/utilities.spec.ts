import {TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Optional, ValueProvider} from '@angular/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MAT_CHECKBOX_DEFAULT_OPTIONS} from '@angular/material/checkbox';
import {MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material/radio';
import {MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS} from '@angular/material/slide-toggle';
import {MATERIAL_SANITY_CHECKS} from '@angular/material/core';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {TranslateLoader} from '@ngx-translate/core';
import {of} from 'rxjs';
import {ObMultiTranslateLoader, TRANSLATION_FILES} from './multi-translate-loader/multi-translate-loader';
import {
	OB_MATERIAL_CONFIG,
	WINDOW,
	checkboxOptionsProvider,
	getRootRoute,
	getTranslateLoader,
	isNotKeyboardEventOnButton,
	matFormFieldDefaultOptionsProvider,
	multiTranslateLoader,
	obFocusWithOutline,
	obliqueProviders,
	provideObliqueConfiguration,
	radioOptionsProvider,
	slideToggleOptionsProvider,
	stepperOptionsOptionsProvider,
	tabsOptionsProvider,
	windowProvider
} from './utilities';
import {MAT_TABS_CONFIG} from '@angular/material/tabs';

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
			const object = getTranslateLoader(httpClient, files);

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

	describe('multiTranslateLoader', () => {
		it('should return default config without additional config', () => {
			expect(multiTranslateLoader()).toEqual({
				loader: {
					provide: TranslateLoader,
					useFactory: getTranslateLoader,
					deps: [HttpClient, [new Optional(), TRANSLATION_FILES]]
				}
			});
		});

		it('should ignore the loader configuration if provided', () => {
			expect(multiTranslateLoader({loader: {provide: TranslateLoader, useValue: {}}})).toEqual({
				loader: {
					provide: TranslateLoader,
					useFactory: getTranslateLoader,
					deps: [HttpClient, [new Optional(), TRANSLATION_FILES]]
				}
			});
		});

		it('should prepend any additional configuration', () => {
			expect(multiTranslateLoader({isolate: true})).toEqual({
				isolate: true,
				loader: {
					provide: TranslateLoader,
					useFactory: getTranslateLoader,
					deps: [HttpClient, [new Optional(), TRANSLATION_FILES]]
				}
			});
		});
	});

	describe('matFormFieldDefaultOptionsProvider', () => {
		it('should return default config without parameters', () => {
			expect(matFormFieldDefaultOptionsProvider()).toEqual({appearance: 'outline'});
		});

		it('should return given config when provided as parameters', () => {
			expect(matFormFieldDefaultOptionsProvider({MAT_FORM_FIELD_DEFAULT_OPTIONS: {appearance: 'fill'}})).toEqual({appearance: 'fill'});
		});
	});

	describe('stepperOptionsOptionsProvider', () => {
		it('should return default config without parameters', () => {
			expect(stepperOptionsOptionsProvider()).toEqual({displayDefaultIndicatorType: false});
		});

		it('should return given config when provided as parameters', () => {
			expect(stepperOptionsOptionsProvider({STEPPER_GLOBAL_OPTIONS: {displayDefaultIndicatorType: true}})).toEqual({
				displayDefaultIndicatorType: true
			});
		});
	});

	describe('checkboxOptionsProvider', () => {
		it('should return default config without parameters', () => {
			expect(checkboxOptionsProvider()).toEqual({color: 'primary'});
		});

		it('should return given config when provided as parameters', () => {
			expect(checkboxOptionsProvider({MAT_CHECKBOX_OPTIONS: {color: 'accent'}})).toEqual({color: 'accent'});
		});
	});

	describe('radioOptionsProvider', () => {
		it('should return default config without parameters', () => {
			expect(radioOptionsProvider()).toEqual({color: 'primary'});
		});

		it('should return given config when provided as parameters', () => {
			expect(radioOptionsProvider({MAT_RADIO_OPTIONS: {color: 'accent'}})).toEqual({color: 'accent'});
		});
	});

	describe('slideToggleOptionsProvider', () => {
		it('should return default config without parameters', () => {
			expect(slideToggleOptionsProvider()).toEqual({color: 'primary'});
		});

		it('should return given config when provided as parameters', () => {
			expect(slideToggleOptionsProvider({MAT_SLIDE_TOGGLE_OPTIONS: {color: 'accent'}})).toEqual({color: 'accent'});
		});
	});

	describe('tabsOptionsProvider', () => {
		it('should return default config without parameters', () => {
			expect(tabsOptionsProvider()).toEqual({stretchTabs: false});
		});

		it('should return given config when provided as parameters', () => {
			expect(tabsOptionsProvider({MAT_TABS_CONFIG: {stretchTabs: true}})).toEqual({stretchTabs: true});
		});
	});

	describe('obliqueProviders', () => {
		it('should return 8 configurations', () => {
			expect(obliqueProviders().length).toBe(8);
		});

		it.each([
			MAT_FORM_FIELD_DEFAULT_OPTIONS,
			STEPPER_GLOBAL_OPTIONS,
			MAT_CHECKBOX_DEFAULT_OPTIONS,
			MAT_RADIO_DEFAULT_OPTIONS,
			MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS,
			MAT_TABS_CONFIG,
			WINDOW,
			MATERIAL_SANITY_CHECKS
		])('should contain ½s', provide => {
			expect(obliqueProviders().find(provider => (provider as ValueProvider).provide === provide)).toBeTruthy();
		});
	});

	describe('provideObliqueConfiguration', () => {
		describe('with default configuration', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [provideObliqueConfiguration()]
				});
			});

			it('should create WINDOW injection token', () => {
				expect(TestBed.inject(WINDOW)).toEqual(window);
			});

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

		describe('with custom configuration', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						provideObliqueConfiguration({
							material: {
								MAT_FORM_FIELD_DEFAULT_OPTIONS: {floatLabel: 'always'},
								STEPPER_GLOBAL_OPTIONS: {showError: true},
								MAT_CHECKBOX_OPTIONS: {clickAction: 'check'},
								MAT_RADIO_OPTIONS: {color: 'accent'},
								MAT_SLIDE_TOGGLE_OPTIONS: {hideIcon: true},
								MAT_TABS_CONFIG: {fitInkBarToContent: true}
							}
						})
					]
				});
			});

			it('should create WINDOW injection token', () => {
				expect(TestBed.inject(WINDOW)).toEqual(window);
			});

			it.each([
				{token: MAT_FORM_FIELD_DEFAULT_OPTIONS, config: {floatLabel: 'always'}},
				{token: STEPPER_GLOBAL_OPTIONS, config: {showError: true}},
				{token: MAT_CHECKBOX_DEFAULT_OPTIONS, config: {clickAction: 'check'}},
				{token: MAT_RADIO_DEFAULT_OPTIONS, config: {color: 'accent'}},
				{token: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, config: {hideIcon: true}},
				{token: MAT_TABS_CONFIG, config: {fitInkBarToContent: true}}
			])('should create $token injection token', ({token, config}) => {
				expect(TestBed.inject(token)).toEqual(config);
			});
		});

		describe('with token configuration for Material', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [
						provideObliqueConfiguration(),
						{
							provide: OB_MATERIAL_CONFIG,
							useValue: {
								MAT_FORM_FIELD_DEFAULT_OPTIONS: {floatLabel: 'always'},
								STEPPER_GLOBAL_OPTIONS: {showError: true},
								MAT_CHECKBOX_OPTIONS: {clickAction: 'check'},
								MAT_RADIO_OPTIONS: {color: 'accent'},
								MAT_SLIDE_TOGGLE_OPTIONS: {hideIcon: true},
								MAT_TABS_CONFIG: {fitInkBarToContent: true}
							}
						}
					]
				});
			});

			it('should create WINDOW injection token', () => {
				expect(TestBed.inject(WINDOW)).toEqual(window);
			});

			it.each([
				{token: MAT_FORM_FIELD_DEFAULT_OPTIONS, config: {floatLabel: 'always'}},
				{token: STEPPER_GLOBAL_OPTIONS, config: {showError: true}},
				{token: MAT_CHECKBOX_DEFAULT_OPTIONS, config: {clickAction: 'check'}},
				{token: MAT_RADIO_DEFAULT_OPTIONS, config: {color: 'accent'}},
				{token: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, config: {hideIcon: true}},
				{token: MAT_TABS_CONFIG, config: {fitInkBarToContent: true}}
			])('should create $token injection token', ({token, config}) => {
				expect(TestBed.inject(token)).toEqual(config);
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
