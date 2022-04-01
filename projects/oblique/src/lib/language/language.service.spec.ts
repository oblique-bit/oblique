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
			expect(() => new ObLanguageService(mock, null, config, null)).toThrow(
				"Oblique's MasterLayout config needs to either define at least 1 locale or to be disabled."
			);
		});
	});

	describe('with valid locales', () => {
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

		describe('setAdapter', () => {
			it('should subscribe to locale change', () => {
				jest.spyOn(service.locale$, 'subscribe');
				service.setLocaleOnAdapter(null);
				expect(service.locale$.subscribe).toHaveBeenCalled();
			});

			it('should set the locale on the adapter', () => {
				const adapter = {setLocale: jest.fn()} as unknown as DateAdapter<any>;
				service.setLocaleOnAdapter(adapter);
				expect(adapter.setLocale).toHaveBeenCalled();
			});
		});
	});
});
