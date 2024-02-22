import {TestBed} from '@angular/core/testing';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {multiTranslateLoader} from '../../../oblique/src/lib/utilities';
import {TranslationsService} from './translations-service';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';

describe(TranslationsService.name, () => {
	let service: TranslationsService;
	let translate: TranslateService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot(multiTranslateLoader())],
			providers: [TranslationsService, {provide: HttpClient, useValue: {get: jest.fn(() => of({}))}}]
		}).compileComponents();

		service = TestBed.inject(TranslationsService);
		translate = TestBed.inject(TranslateService);
	});

	describe('languageChange$', () => {
		it('should be mapped to translate.onLangChange', () => {
			const randomLanguage = 'rr';

			let languageChange: string;
			service.languageChange$.subscribe(event => {
				languageChange = event;
			});
			translate.use(randomLanguage);

			expect(languageChange).toBe(randomLanguage);
		});
	});

	describe('initializeTranslations', () => {
		describe('parseLanguages', () => {
			it('should fail when using wrong languages format', () => {
				const func = (): void => service.initializeTranslations('en,error', undefined);
				expect(func).toThrow(`"language-list" expects a comma`);
			});

			it('should fail when using unknown language `zz` is used', () => {
				const func = (): void => service.initializeTranslations('en,zz', undefined);
				expect(func).toThrow(`Unknown "zz" language`);
			});

			it('should find en,fr,de in the translate service', () => {
				const languageList = ['en', 'fr', 'de', 'it'];
				service.initializeTranslations(languageList.join(','), undefined);

				expect(translate.langs).toEqual(languageList);
			});
		});

		describe('parseDefaultLanguage', () => {
			const languageList = 'en,fr';
			it('should fail when using wrong languages format', () => {
				const func = (): void => service.initializeTranslations(languageList, 'error');
				expect(func).toThrow(`"default-language" expects an ISO 639-1`);
			});

			it('should display a message when using an unknown languages format', () => {
				const infoSpy = jest.spyOn(console, `info`).mockImplementation(() => {});
				service.initializeTranslations(languageList, 'zz');

				expect(infoSpy).toHaveBeenCalledWith(`No or invalid default language is provided, falling back to en`);
			});

			it('should find en the translate service as defaultLang', () => {
				const expectedLang = 'en';
				service.initializeTranslations(languageList, expectedLang);

				expect(translate.defaultLang).toEqual(expectedLang);
			});
		});
	});

	describe('buildTranslations', () => {
		describe('infoLinks', () => {
			const infoLinks = [{fr: 'Lien de contact', en: 'Contact link', links: {fr: 'https://fr.contact.com', en: 'https://en.contact.com'}}];

			beforeEach(() => {
				translate.setDefaultLang('en');
				service.initializeTranslations('en', 'en');
				service.handleTranslations(JSON.stringify(infoLinks), '');
			});

			it('should populate the translations info-link.0.label with "Contact link"', () => {
				expect(translate.instant('info-link.0.label')).toEqual(infoLinks[0].en);
			});

			it('should populate the translations info-link.0.url with "https://en.contact.com"', () => {
				expect(translate.instant('info-link.0.url')).toEqual(infoLinks[0].links.en);
			});
		});

		describe('profileLinks', () => {
			describe('empty', () => {
				it('should not fail', () => {
					translate.setDefaultLang('en');
					service.initializeTranslations('en', 'en');
					const func = (): void => service.handleTranslations('', null);
					expect(func).not.toThrow();
				});
			});

			describe('with data', () => {
				const profileLinks = [
					{fr: 'Lien de profile 1', en: 'Profile link 1', links: {fr: 'https://fr.profile.com', en: 'https://en.profile.com'}}
				];

				beforeEach(() => {
					translate.setDefaultLang('en');
					service.initializeTranslations('en', 'en');
					service.handleTranslations('', JSON.stringify(profileLinks));
				});

				it('should populate the translations profile-link.0.label with "Contact link"', () => {
					expect(translate.instant('profile-link.0.label')).toEqual(profileLinks[0].en);
				});

				it('should populate the translations profile-link.0.url with "Contact link"', () => {
					expect(translate.instant('profile-link.0.url')).toEqual(profileLinks[0].links.en);
				});
			});
		});
	});
});
