import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA, DebugElement} from '@angular/core';
import {EMPTY, Observable, Subject} from 'rxjs';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {OB_BANNER, OB_HAS_LANGUAGE_IN_URL, WINDOW} from '../../utilities';
import {ObMasterLayoutHeaderComponent} from './master-layout-header.component';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObMockMasterLayoutConfig} from '../_mocks/mock-master-layout.config';
import {ObMasterLayoutService} from '../master-layout.service';
import {ObEEnvironment, ObEMasterLayoutEventValues, ObIMasterLayoutEvent, ObINavigationLink} from '../master-layout.model';
import {By} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {ObLocalizePipe} from '../../router/ob-localize.pipe';

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
			imports: [ObMockTranslatePipe, RouterTestingModule, ObLocalizePipe],
			declarations: [ObMasterLayoutHeaderComponent],
			providers: [
				{provide: ObMasterLayoutService, useValue: mockMasterLayoutService},
				{provide: ObMasterLayoutConfig, useClass: ObMockMasterLayoutConfig},
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: OB_HAS_LANGUAGE_IN_URL, useValue: true},
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
			LOCAL: 'rgb(4, 120, 87)',
			DEV: 'rgb(255, 215, 0)',
			REF: 'rgb(234, 88, 12)',
			TEST: 'rgb(70, 89, 107)',
			ABN: 'rgb(153, 25, 30)'
		};
		const colors: Record<ObEEnvironment, string> = {
			LOCAL: 'rgb(255, 255, 255)',
			DEV: 'rgb(28, 40, 52)',
			REF: 'rgb(28, 40, 52)',
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
				expect(banner.styles['background-color']).toBe('rgb(4, 120, 87)');
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

	describe('emitNavigation', () => {
		let emittedValue: ObINavigationLink[];
		beforeEach(done => {
			component.navigationChanged.subscribe(list => {
				emittedValue = list;
				done();
			});
			component.emitNavigation([{id: 'id', url: 'url', label: 'label'}]);
		});

		test('navigationChanged emits the given parameter', () => {
			expect(emittedValue).toEqual([{id: 'id', url: 'url', label: 'label'}]);
		});
	});

	function globalSetup(): void {
		fixture = TestBed.createComponent(ObMasterLayoutHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}
});
