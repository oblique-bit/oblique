import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {WINDOW} from '../../utilities';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObMockGlobalEventsService} from '../../global-events/_mocks/mock-global-events.service';
import {ObMasterLayoutComponent} from './master-layout.component';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {ObMockMasterLayoutConfig} from '../_mocks/mock-master-layout.config';
import {ObMockOffCanvasService} from '../../off-canvas/_mocks/mock-off-canvas.service';
import {ObMockScrollingEvents} from '../../scrolling/_mocks/mock-scrolling-events.service';
import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObOffCanvasService} from '../../off-canvas/off-canvas.service';
import {ObScrollingEvents} from '../../scrolling/scrolling-events';
import {ObUseObliqueIcons} from '../../icon/icon.model';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {ObEMasterLayoutEventValues} from '../master-layout.model';
import {appVersion} from '../../version';

describe('ObMasterLayoutComponent', () => {
	let component: ObMasterLayoutComponent;
	let fixture: ComponentFixture<ObMasterLayoutComponent>;
	const mockMasterLayoutService = {
		layout: {
			configEvents$: new Subject(),
			hasCover: false,
			hasLayout: false,
			isMenuOpened: false,
			hasMainNavigation: false,
			hasOffCanvas: false
		},
		header: {configEvents$: new Subject(), isSticky: false},
		footer: {configEvents$: new Subject(), isSticky: false}
	};

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [RouterTestingModule],
				declarations: [ObMasterLayoutComponent, ObMockTranslatePipe],
				providers: [
					{provide: TranslateService, useClass: ObMockTranslateService},
					{provide: ObMasterLayoutService, useValue: mockMasterLayoutService},
					{provide: ObMasterLayoutConfig, useClass: ObMockMasterLayoutConfig},
					{provide: ObOffCanvasService, useClass: ObMockOffCanvasService},
					{provide: ObScrollingEvents, useClass: ObMockScrollingEvents},
					{provide: ObGlobalEventsService, useClass: ObMockGlobalEventsService},
					{provide: ObUseObliqueIcons, useValue: true},
					{provide: WINDOW, useValue: window}
				],
				schemas: [CUSTOM_ELEMENTS_SCHEMA]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ObMasterLayoutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have ob-master-layout class', () => {
		expect(fixture.debugElement.nativeElement.classList.contains('ob-master-layout')).toBe(true);
	});

	it('should have ob-version attribute', () => {
		expect(fixture.debugElement.nativeElement.getAttribute('ob-version')).toBe(appVersion);
	});

	describe('properties', () => {
		it('should have a home property', () => {
			expect(component.home).toBe('/home');
		});

		it('should have a route property', () => {
			expect(component.route).toEqual({path: '', params: undefined});
		});

		it('should have a navigation property', () => {
			expect(component.navigation).toEqual([]);
		});

		it('should have a jumpLinks property', () => {
			expect(component.jumpLinks).toEqual([]);
		});

		testLayoutProperty('hasCover', 'LAYOUT_HAS_COVER');
		testLayoutProperty('hasLayout', 'LAYOUT_HAS_DEFAULT_LAYOUT');
		testLayoutProperty('isMenuOpened', 'IS_MENU_OPENED');
		testLayoutProperty('hasOffCanvas', 'LAYOUT_HAS_OFF_CANVAS');
		testComponentProperty('isHeaderSticky', 'HEADER_IS_STICKY');
		testComponentProperty('isFooterSticky', 'FOOTER_IS_STICKY');

		function testLayoutProperty(property: string, enumName: string): void {
			describe(property, () => {
				it('should be defined', () => {
					expect(component[property]).toBe(mockMasterLayoutService.layout[property]);
				});
				it('should be updated with the service', () => {
					mockMasterLayoutService.layout.configEvents$.next({name: ObEMasterLayoutEventValues[enumName], value: true});
					expect(component[property]).toBe(true);
				});
			});
		}

		describe('noNavigation', () => {
			it('should be defined', () => {
				expect(component.noNavigation).toBe(true);
			});
			it('should be updated with the service', () => {
				mockMasterLayoutService.layout.configEvents$.next({name: ObEMasterLayoutEventValues.LAYOUT_HAS_MAIN_NAVIGATION, value: true});
				expect(component.noNavigation).toBe(false);
			});
		});

		function testComponentProperty(property: string, enumName: string): void {
			describe(property, () => {
				it('should be defined', () => {
					expect(component[property]).toBe(false);
				});
				it('should be updated with the service', () => {
					mockMasterLayoutService.layout.configEvents$.next({name: ObEMasterLayoutEventValues[enumName], value: true});
					expect(component[property]).toBe(true);
				});
			});
		}

		it('should have a isScrolling property', () => {
			expect(component.isScrolling).toBe(false);
		});

		it('should have a outline property', () => {
			expect(component.outline).toBe(false);
		});
	});

	describe('removeOutline', () => {
		it('should set outline to false', () => {
			component.removeOutline();
			expect(component.outline).toBe(false);
		});
	});

	describe('addOutline', () => {
		it('should set outline to true', () => {
			component.addOutline();
			expect(component.outline).toBe(true);
		});
	});

	describe('scrollTop', () => {
		it('should call hasScrolled function', () => {
			const scrollEvent = TestBed.inject(ObScrollingEvents);
			jest.spyOn(scrollEvent, 'hasScrolled');
			component.scrollTop();
			expect(scrollEvent.hasScrolled).toHaveBeenCalledWith(0);
		});

		describe('with a scrolled element', () => {
			let scrollEvent: ObScrollingEvents;
			beforeEach(() => {
				scrollEvent = TestBed.inject(ObScrollingEvents);
				jest.spyOn(scrollEvent, 'scrolling');
				component.scrollTop({scrollTop: 15} as unknown as HTMLElement);
			});

			it('should set isScrolling', () => {
				expect(component.isScrolling).toBe(true);
			});

			it('should call scrolling', () => {
				expect(scrollEvent.scrolling).toHaveBeenCalledWith(true);
			});
		});

		describe('with an unscrolled element', () => {
			let scrollEvent: ObScrollingEvents;
			beforeEach(() => {
				scrollEvent = TestBed.inject(ObScrollingEvents);
				jest.spyOn(scrollEvent, 'scrolling');
				component.scrollTop({scrollTop: 0} as unknown as HTMLElement);
			});

			it('should not set isScrolling', () => {
				expect(component.isScrolling).toBe(false);
			});

			it('should not call scrolling', () => {
				expect(scrollEvent.scrolling).not.toHaveBeenCalled();
			});
		});

		describe('with no element', () => {
			let scrollEvent: ObScrollingEvents;
			beforeEach(() => {
				scrollEvent = TestBed.inject(ObScrollingEvents);
				jest.spyOn(scrollEvent, 'scrolling');
				component.scrollTop();
			});

			it('should not set isScrolling', () => {
				expect(component.isScrolling).toBe(false);
			});

			it('should not call scrolling', () => {
				expect(scrollEvent.scrolling).not.toHaveBeenCalled();
			});
		});
	});
});
