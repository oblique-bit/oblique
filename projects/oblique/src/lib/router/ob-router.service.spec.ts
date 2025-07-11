import {TestBed} from '@angular/core/testing';
import {Router, Routes, provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {Component} from '@angular/core';
import {TranslateLoader, TranslateService} from '@ngx-translate/core';
import {ObRouterService} from './ob-router.service';
import {AccessibilityStatementComponent} from '../accessibility-statement/accessibility-statement.component';
import {provideObliqueConfiguration} from '../utilities';
import {ObMasterLayoutConfig} from '../master-layout/master-layout.config';
import {ObEScrollMode} from '../master-layout/master-layout.model';
import {ObLanguageService} from '../language/language.service';
import {firstValueFrom, of} from 'rxjs';

@Component({template: '', standalone: false})
export class MockComponent {}

describe(ObRouterService.name, () => {
	let service: ObRouterService;
	let router: Router;
	let translate: TranslateService;
	const mockMasterLayoutConfig = {
		homePageRoute: '/home',
		focusableFragments: ['content', 'navigation'],
		scrollToTopDuration: 200,
		showAccessibilityTitle: true,
		locale: {
			locales: ['de-CH', 'fr-CH', 'it-CH'],
			defaultLanguage: 'de',
			disabled: false,
			display: true,
			languages: {
				de: 'Deutsch',
				fr: 'Français',
				it: 'Italiano',
				en: 'English'
			}
		},
		layout: {
			hasCover: false,
			hasMainNavigation: true,
			hasOffCanvas: false,
			hasLayout: true,
			hasMaxWidth: false
		},
		header: {
			isSticky: true,
			isSmall: false,
			isCustom: false,
			serviceNavigation: {
				profileLinks: [],
				infoLinks: [],
				infoContact: {},
				maxLastUsedApplications: 3,
				maxFavoriteApplications: 3,
				displayLanguages: true,
				pamsAppId: undefined,
				handleLogout: true
			}
		},
		navigation: {
			isFullWidth: false,
			scrollMode: ObEScrollMode.AUTO,
			scrollDelta: 95,
			activeClass: 'active',
			links: []
		},
		footer: {
			isSticky: false,
			isCustom: false
		}
	};
	const routes = [
		{
			component: MockComponent,
			path: 'home',
			data: {masterLayout: {homePageRoute: 'test'}}
		}
	];

	describe('without hasLanguageInUrl', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					provideHttpClient(),
					provideRouter(routes),
					provideObliqueConfiguration({
						accessibilityStatement: {
							applicationName: '',
							conformity: 'none',
							applicationOperator: '',
							createdOn: new Date(),
							contact: {emails: ['']}
						},
						hasLanguageInUrl: false
					}),
					{provide: ObMasterLayoutConfig, useValue: mockMasterLayoutConfig}
				]
			});
		});

		describe.each([
			{
				text: 'with',
				showAccessibilityTitle: true,
				data: {title: 'i18n.oblique.accessibility-statement.statement.title'}
			},
			{
				text: 'without',
				showAccessibilityTitle: false,
				data: undefined
			}
		])('$text showAccessibilityTitle', ({showAccessibilityTitle, data}) => {
			beforeEach(() => {
				TestBed.overrideProvider(ObMasterLayoutConfig, {useValue: {...mockMasterLayoutConfig, showAccessibilityTitle}});
				translate = TestBed.inject(TranslateService);
				router = TestBed.inject(Router);
				service = TestBed.inject(ObRouterService);
			});

			test('service creation', () => {
				expect(service).toBeTruthy();
			});

			test('ObLanguageService instantiation', () => {
				expect(TestBed.inject(ObLanguageService)).toBeTruthy();
			});

			test('accessibility statement route is added', () => {
				expect(TestBed.inject(Router).config).toEqual([
					{
						component: AccessibilityStatementComponent,
						path: 'accessibility-statement',
						data
					},
					...routes
				]);
			});
		});
	});

	describe('with hasLanguageInUrl', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					provideHttpClient(),
					provideRouter(routes),
					provideObliqueConfiguration({
						accessibilityStatement: {
							applicationName: '',
							conformity: 'none',
							applicationOperator: '',
							createdOn: new Date(),
							contact: {emails: ['']}
						},
						hasLanguageInUrl: true
					}),
					{provide: ObMasterLayoutConfig, useValue: mockMasterLayoutConfig},
					{provide: TranslateLoader, useValue: {getTranslation: () => of({})}}
				]
			});
		});

		describe.each([
			{
				text: 'with',
				showAccessibilityTitle: true,
				data: {title: 'i18n.oblique.accessibility-statement.statement.title'}
			},
			{
				text: 'without',
				showAccessibilityTitle: false,
				data: undefined
			}
		])('$text showAccessibilityTitle', ({showAccessibilityTitle, data}) => {
			beforeEach(() => {
				TestBed.overrideProvider(ObMasterLayoutConfig, {useValue: {...mockMasterLayoutConfig, showAccessibilityTitle}});
				translate = TestBed.inject(TranslateService);
				router = TestBed.inject(Router);
				service = TestBed.inject(ObRouterService);
			});

			test('service creation', () => {
				expect(service).toBeTruthy();
			});

			test('ObLanguageService instantiation', () => {
				expect(TestBed.inject(ObLanguageService)).toBeTruthy();
			});

			describe('route configuration', () => {
				let routeConfig: Routes;
				beforeEach(() => {
					routeConfig = TestBed.inject(Router).config;
				});

				test('has 2 root routes', () => {
					expect(routeConfig.length).toBe(2);
				});

				describe('1st route', () => {
					test('has matcher', () => {
						expect(routeConfig[0].matcher).toBeDefined();
					});

					test('has base route config as children', () => {
						expect(TestBed.inject(Router).config[0].children).toEqual([
							{
								component: AccessibilityStatementComponent,
								path: 'accessibility-statement',
								data
							},
							...routes
						]);
					});
				});

				describe('2nd route', () => {
					test('have empty path', () => {
						expect(routeConfig[1].path).toBe('');
					});

					test('have a redirector', () => {
						expect(routeConfig[1].redirectTo).toBeDefined();
					});
				});
			});

			describe('navigate', () => {
				beforeEach(() => {
					translate.use('de');
					router.initialNavigation();
				});

				test.each([
					{route: '', url: '/de'},
					{route: 'non-existent', url: '/de'},
					{route: 'de/home', url: '/de/home'},
					{route: 'fr', url: '/fr'},
					{route: 'fr/home', url: '/fr/home'}
				])('"$route" route redirects to "$url"', async ({route, url}) => {
					await router.navigate([route]);
					expect(router.url).toBe(url);
				});

				test('update language', async () => {
					await router.navigate(['it']);
					expect(translate.currentLang).toBe('it');
				});
			});

			describe('change language', () => {
				test('update language in URL', async () => {
					await firstValueFrom(translate.use('en'));
					expect(router.url).toBe('/en');
				});

				test('update language in URL but stay on same page', async () => {
					await router.navigate(['it/home']);
					await firstValueFrom(translate.use('en'));
					expect(router.url).toBe('/en/home');
				});
			});
		});
	});
});
