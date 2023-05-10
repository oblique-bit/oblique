import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA, DebugElement} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EMPTY, Observable, Subject} from 'rxjs';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {OB_BANNER, WINDOW} from '../../utilities';
import {ObMockGlobalEventsService} from '../../global-events/_mocks/mock-global-events.service';
import {ObMasterLayoutHeaderComponent} from './master-layout-header.component';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObMockMasterLayoutConfig} from '../_mocks/mock-master-layout.config';
import {ObMockScrollingEvents} from '../../scrolling/_mocks/mock-scrolling-events.service';
import {ObScrollingEvents} from '../../scrolling/scrolling-events';
import {ObMasterLayoutService} from '../master-layout.service';
import {ObEEnvironment, ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from '../master-layout.model';
import {By} from '@angular/platform-browser';

describe('ObMasterLayoutHeaderComponent', () => {
	let component: ObMasterLayoutHeaderComponent;
	let fixture: ComponentFixture<ObMasterLayoutHeaderComponent>;
	const mockMasterLayoutService = {
		homePageRouteChange$: EMPTY,
		header: {
			configEvents$: new Subject<ObIMasterLayoutEvent>(),
			isCustom: false,
			isSmall: false,
			serviceNavigation: {},
			emitLoginState: jest.fn(),
			emitLogoutUrl: jest.fn()
		},
		layout: {configEvents$: new Subject<ObIMasterLayoutEvent>(), isMenuOpened: false}
	};

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [ObMasterLayoutHeaderComponent, ObMockTranslatePipe],
			providers: [
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: ObMasterLayoutService, useValue: mockMasterLayoutService},
				{provide: ObMasterLayoutConfig, useClass: ObMockMasterLayoutConfig},
				{provide: ObScrollingEvents, useClass: ObMockScrollingEvents},
				{provide: ObGlobalEventsService, useClass: ObMockGlobalEventsService},
				{provide: WINDOW, useValue: window}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	describe('Without OB_BANNER injectionToken', () => {
		beforeEach(() => {
			globalSetup();
		});

		it('should create', () => {
			expect(component).toBeTruthy();
		});

		it('should have ob-master-layout-header class', () => {
			expect(fixture.debugElement.nativeElement.classList.contains('ob-master-layout-header')).toBe(true);
		});

		describe('properties', () => {
			it('should have a home$ property', () => {
				expect(component.home$ instanceof Observable).toBe(true);
			});

			describe('isCustom', () => {
				it('should be defined', () => {
					expect(component.isCustom).toBe(mockMasterLayoutService.header.isCustom);
				});

				it('should be updated with the service', () => {
					mockMasterLayoutService.header.configEvents$.next({name: ObEMasterLayoutEventValues.HEADER_IS_CUSTOM, value: true});
					expect(component.isCustom).toBe(true);
				});
			});

			describe('isSmall', () => {
				it('should be defined', () => {
					expect(component.isSmall).toBe(mockMasterLayoutService.header.isSmall);
				});

				it('should be updated with the service', () => {
					mockMasterLayoutService.header.configEvents$.next({name: ObEMasterLayoutEventValues.HEADER_IS_SMALL, value: true});
					expect(component.isSmall).toBe(true);
				});
			});

			describe('serviceNavigationConfig', () => {
				it('should be defined', () => {
					expect(component.serviceNavigationConfig).toEqual({});
				});

				it('should be set to the value emitted by the ObMasterLayoutService', () => {
					mockMasterLayoutService.header.configEvents$.next({
						name: ObEMasterLayoutEventValues.SERVICE_NAVIGATION_CONFIGURATION,
						config: {displayApplications: true}
					});
					expect(component.serviceNavigationConfig).toEqual({displayApplications: true});
				});
			});
		});

		describe('isLangActive', () => {
			it('should return true for en', () => {
				expect(component.isLangActive('en')).toBe(true);
			});

			it('should return true for de', () => {
				expect(component.isLangActive('de')).toBe(false);
			});
		});

		describe('changeLang', () => {
			it('should call use', () => {
				const translate = TestBed.inject(TranslateService);
				jest.spyOn(translate, 'use');
				component.changeLang('de');
				expect(translate.use).toHaveBeenCalledWith('de');
			});
		});

		describe('languages', () => {
			describe('property', () => {
				it('should be defined', () => {
					expect(component.languages).toBeDefined();
				});

				it('should have a default values', () => {
					expect(component.languages).toEqual([
						{code: 'de', id: undefined, label: 'Deutsch'},
						{code: 'fr', id: undefined, label: 'Français'},
						{code: 'it', id: undefined, label: 'Italiano'}
					]);
				});
			});
		});

		describe('emitLoginState', () => {
			beforeEach(() => {
				jest.spyOn(mockMasterLayoutService.header, 'emitLoginState');
				component.emitLoginState('S2OK');
			});

			it('should call emitLoginState on master layout service once', () => {
				expect(mockMasterLayoutService.header.emitLoginState).toHaveBeenCalledTimes(1);
			});

			it('should call emitLoginState on master layout service with the same parameter', () => {
				expect(mockMasterLayoutService.header.emitLoginState).toHaveBeenCalledWith('S2OK');
			});
		});

		describe('emitLogoutUrl', () => {
			beforeEach(() => {
				jest.spyOn(mockMasterLayoutService.header, 'emitLogoutUrl');
				component.emitLogoutUrl('http://logout');
			});

			it('should call emitLogoutUrl on master layout service once', () => {
				expect(mockMasterLayoutService.header.emitLogoutUrl).toHaveBeenCalledTimes(1);
			});

			it('should call emitLogoutUrl on master layout service with the same parameter', () => {
				expect(mockMasterLayoutService.header.emitLogoutUrl).toHaveBeenCalledWith('http://logout');
			});
		});
	});

	describe('With OB_BANNER injectionToken', () => {
		const backgroundColors: Record<ObEEnvironment, string> = {
			LOCAL: 'rgb(0, 129, 58)',
			DEV: 'rgb(255, 215, 0)',
			REF: 'rgb(231, 94, 0)',
			TEST: 'rgb(0, 102, 153)',
			ABN: 'rgb(176, 0, 32)'
		};
		const colors: Record<ObEEnvironment, string> = {
			LOCAL: 'rgb(255, 255, 255)',
			DEV: 'rgb(23, 23, 23)',
			REF: 'rgb(23, 23, 23)',
			TEST: 'rgb(255, 255, 255)',
			ABN: 'rgb(255, 255, 255)'
		};
		let banner: DebugElement;
		describe.each(Object.values(ObEEnvironment))('Environment %s', environment => {
			beforeEach(() => {
				TestBed.overrideProvider(OB_BANNER, {useValue: {text: environment}});
				globalSetup();
				banner = fixture.debugElement.query(By.css('aside'));
			});

			it('should have the correct text', () => {
				expect(banner.nativeElement.textContent).toBe(environment);
			});

			it('should have the correct background-color', () => {
				expect(banner.styles['background-color']).toBe(backgroundColors[environment]);
			});

			it('should have the correct color', () => {
				expect(banner.styles.color).toBe(colors[environment]);
			});
		});

		describe('With an unknown environment', () => {
			beforeEach(() => {
				TestBed.overrideProvider(OB_BANNER, {useValue: {text: 'unknownBanner'}});

				globalSetup();
				banner = fixture.debugElement.query(By.css('aside'));
			});

			it('should have the correct text', () => {
				expect(banner.nativeElement.textContent).toBe('unknownBanner');
			});

			it('should have correct background-color', () => {
				expect(banner.styles['background-color']).toBe('rgb(0, 129, 58)');
			});

			it('should have correct color', () => {
				expect(banner.styles.color).toBe('rgb(255, 255, 255)');
			});
		});

		describe.each(Object.values(ObEEnvironment))('With manually set values on %s environment', environment => {
			beforeEach(() => {
				TestBed.overrideProvider(OB_BANNER, {useValue: {text: environment, color: '#123', bgColor: '#FF99CC'}});

				globalSetup();
				banner = fixture.debugElement.query(By.css('aside'));
			});

			it('should have the correct text', () => {
				expect(banner.nativeElement.textContent).toBe(environment);
			});

			it('should have correct background-color', () => {
				expect(banner.styles['background-color']).toBe('rgb(255, 153, 204)');
			});

			it('should have correct color', () => {
				expect(banner.styles.color).toBe('rgb(17, 34, 51)');
			});
		});
	});

	function globalSetup(): void {
		fixture = TestBed.createComponent(ObMasterLayoutHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}
});
