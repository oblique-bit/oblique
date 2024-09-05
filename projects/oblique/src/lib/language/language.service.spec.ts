import {TestBed} from '@angular/core/testing';
import {DateAdapter} from '@angular/material/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subject} from 'rxjs';
import {ObLanguageService} from './language.service';
import {ObMasterLayoutConfig} from '../master-layout/master-layout.config';

describe('LanguageService', () => {
	let service: ObLanguageService;
	let translate: TranslateService;

	describe('with invalid locales', () => {
		const mock = {} as TranslateService;
		const config = {
			locale: {
				locales: [],
				default: 'de',
				disabled: false,
				display: true
			}
		} as unknown as ObMasterLayoutConfig;

		it('should throw', () => {
			expect(() => new ObLanguageService(mock, null, config, null, null)).toThrow(
				"Oblique's MasterLayout config needs to either define at least 1 locale or to be disabled."
			);
		});
	});

	describe('with valid locales and without DateAdapter', () => {
		beforeEach(() => {
			const mock = {
				addLangs: jest.fn(),
				setDefaultLang: jest.fn(),
				use: jest.fn(),
				onLangChange: new Subject<void>(),
				getBrowserLang: jest.fn(),
				getDefaultLang: jest.fn(),
				currentLang: 'de'
			};
			jest.spyOn(console, 'warn');

			TestBed.configureTestingModule({
				providers: [
					{provide: TranslateService, useValue: mock},
					{
						provide: ObMasterLayoutConfig,
						useValue: {
							locale: {
								locales: ['de-CH', 'fr-CH', 'it-CH'],
								default: 'de',
								disabled: false,
								display: true
							}
						}
					}
				]
			});
			service = TestBed.inject(ObLanguageService);
			translate = TestBed.inject(TranslateService);
		});

		it('should be created', () => {
			expect(service).toBeTruthy();
		});

		it('should call addLangs', () => {
			expect(translate.addLangs).toHaveBeenCalledWith(['de', 'fr', 'it']);
		});

		it('should call setDefaultLang', () => {
			expect(translate.setDefaultLang).toHaveBeenCalledWith('de');
		});

		it('should call use', () => {
			expect(translate.use).toHaveBeenCalledWith('de');
		});

		it('should show a warning in the console', () => {
			expect(console.warn).toHaveBeenCalledWith(
				'No DateAdapter is provided, this means the datepicker might not work properly. "provideMomentDateAdapter" should be added to the root providers.'
			);
		});

		describe('locale$', () => {
			it('should be an observable', () => {
				expect(service.locale$ instanceof Observable).toBe(true);
			});

			it('should emit a locale when language changes to defined one', done => {
				translate.onLangChange.next({lang: 'fr', translations: null});
				service.locale$.subscribe(locale => {
					expect(locale).toBe('fr-CH');
					done();
				});
			});

			it('should emit a language when language changes to undefined one', done => {
				translate.onLangChange.next({lang: 'es', translations: null});
				service.locale$.subscribe(locale => {
					expect(locale).toBe('es');
					done();
				});
			});
		});
	});

	describe('with valid locales and an DateAdapter', () => {
		beforeEach(() => {
			const mock = {
				addLangs: jest.fn(),
				setDefaultLang: jest.fn(),
				use: jest.fn(),
				onLangChange: new Subject<void>(),
				getBrowserLang: jest.fn(),
				getDefaultLang: jest.fn(),
				currentLang: 'de'
			};
			const dateAdapterMock = {setLocale: jest.fn()};
			jest.spyOn(console, 'warn');

			TestBed.configureTestingModule({
				providers: [
					{provide: DateAdapter, useValue: dateAdapterMock},
					{provide: TranslateService, useValue: mock},
					{
						provide: ObMasterLayoutConfig,
						useValue: {
							locale: {
								locales: ['de-CH', 'fr-CH', 'it-CH'],
								default: 'de',
								disabled: false,
								display: true
							}
						}
					}
				]
			});
			service = TestBed.inject(ObLanguageService);
			translate = TestBed.inject(TranslateService);
		});

		it('should be created', () => {
			expect(service).toBeTruthy();
		});

		it('should call addLangs', () => {
			expect(translate.addLangs).toHaveBeenCalledWith(['de', 'fr', 'it']);
		});

		it('should call setDefaultLang', () => {
			expect(translate.setDefaultLang).toHaveBeenCalledWith('de');
		});

		it('should call use', () => {
			expect(translate.use).toHaveBeenCalledWith('de');
		});

		it('should set the locale on the adapter', () => {
			const adapter = TestBed.inject(DateAdapter);
			expect(adapter.setLocale).toHaveBeenCalledWith('de-CH');
		});

		describe('locale$', () => {
			it('should be an observable', () => {
				expect(service.locale$ instanceof Observable).toBe(true);
			});

			it('should emit a locale when language changes to defined one', done => {
				translate.onLangChange.next({lang: 'fr', translations: null});
				service.locale$.subscribe(locale => {
					expect(locale).toBe('fr-CH');
					done();
				});
			});

			it('should emit a language when language changes to undefined one', done => {
				translate.onLangChange.next({lang: 'es', translations: null});
				service.locale$.subscribe(locale => {
					expect(locale).toBe('es');
					done();
				});
			});
		});
	});
});
