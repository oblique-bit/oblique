import {TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {TranslationsService} from './translations-service';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {provideObliqueTranslations} from '@oblique/oblique';
import type {ObITranslateObject} from './service-navigation-web-component.model';

describe(TranslationsService.name, () => {
	let service: TranslationsService;
	let translate: TranslateService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [
				TranslationsService,
				provideObliqueTranslations(),
				{provide: HttpClient, useValue: {get: jest.fn(() => of({}))}},
			],
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

	describe('setLang', () => {
		it('should call use', () => {
			jest.spyOn(translate, 'use');
			service.initializeTranslations('en,fr', 'fr', 'fr');
			service.setLang('en');
			expect(translate.use).toHaveBeenCalledWith('en');
		});
	});

	describe('initializeTranslations', () => {
		describe('parseLanguages', () => {
			it('should fail when using wrong languages format', () => {
				const func = (): void => service.initializeTranslations('en,error', undefined, undefined);
				expect(func).toThrow(`"language-list" expects a comma`);
			});

			it('should fail when using unknown language `zz` is used', () => {
				const func = (): void => service.initializeTranslations('en,zz', undefined, undefined);
				expect(func).toThrow(`Unknown "zz" language`);
			});

			it('should find en,fr,de in the translate service', () => {
				const languageList = ['en', 'fr', 'de', 'it'];
				service.initializeTranslations(languageList.join(','), undefined, undefined);

				expect(translate.getLangs()).toEqual(languageList);
			});
		});

		describe('parseDefaultLanguage', () => {
			const languageList = 'en,fr';
			it('should fail when using wrong languages format', () => {
				const func = (): void => service.initializeTranslations(languageList, undefined, 'error');
				expect(func).toThrow(`"default-language" expects an ISO 639-1`);
			});

			it('should display a message when using an unknown languages format', () => {
				const infoSpy = jest.spyOn(console, `info`).mockImplementation(() => {});
				service.initializeTranslations(languageList, undefined, 'zz');

				expect(infoSpy).toHaveBeenCalledWith(`No or invalid default language is provided, falling back to en`);
			});

			it('should find en the translate service as defaultLang', () => {
				const expectedLang = 'en';
				service.initializeTranslations(languageList, undefined, expectedLang);

				expect(translate.getFallbackLang()).toEqual(expectedLang);
			});
		});
	});

	describe('buildTranslations', () => {
		describe('infoLinks', () => {
			const infoLinks = [
				{
					fr: 'Lien de contact',
					en: 'Contact link',
					links: {fr: 'https://fr.contact.com', en: 'https://en.contact.com'},
				},
			];

			beforeEach(() => {
				translate.setFallbackLang('en');
				service.initializeTranslations('en', 'en', 'en');
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
					translate.setFallbackLang('en');
					service.initializeTranslations('en', 'en', 'en');
					const func = (): void => service.handleTranslations('', null);
					expect(func).not.toThrow();
				});
			});

			describe('with data', () => {
				const profileLinks = [
					{
						fr: 'Lien de profile 1',
						en: 'Profile link 1',
						links: {fr: 'https://fr.profile.com', en: 'https://en.profile.com'},
					},
				];

				beforeEach(() => {
					translate.setFallbackLang('en');
					service.initializeTranslations('en', 'en', 'en');
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

	describe('addOneTranslation', () => {
		const key = 'test.key';
		const translations = {
			en: 'english',
			fr: 'french',
		} as ObITranslateObject;

		beforeEach(() => {
			service.initializeTranslations('en,fr', 'fr', 'fr');
			service.addOneTranslation(key, translations);
		});

		it.each(['en', 'fr'] as const)('should have test.key with english', languageCode => {
			translate.use(languageCode);
			expect(translate.instant(key)).toEqual(translations[languageCode]);
		});
	});
});
