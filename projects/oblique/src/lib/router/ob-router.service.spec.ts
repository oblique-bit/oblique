import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {ObRouterService} from './ob-router.service';
import {AccessibilityStatementComponent} from '../accessibility-statement/accessibility-statement.component';
import {provideObliqueConfiguration} from '../utilities';
import {ObMasterLayoutConfig} from '../master-layout/master-layout.config';
import {ObEScrollMode} from '../master-layout/master-layout.model';
import {ObLanguageService} from '../language/language.service';

describe(ObRouterService.name, () => {
	let service: ObRouterService;
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

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(),
				provideObliqueConfiguration({
					accessibilityStatement: {
						applicationName: '',
						conformity: 'none',
						applicationOperator: '',
						createdOn: new Date(),
						contact: {emails: ['']}
					}
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
				}
			]);
		});
	});
});
