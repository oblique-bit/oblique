import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Component} from '@angular/core';
import {Router, provideRouter} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {provideObliqueTestingConfiguration} from '../../utilities';
import {ObMockGlobalEventsService} from '../../global-events/_mocks/mock-global-events.service';
import {ObMasterLayoutComponent} from './master-layout.component';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {ObMockMasterLayoutConfig} from '../_mocks/mock-master-layout.config';
import {ObMockOffCanvasService} from '../../off-canvas/_mocks/mock-off-canvas.service';
import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObOffCanvasService} from '../../off-canvas/off-canvas.service';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent, ObINavigationLink} from '../master-layout.model';
import {appVersion} from '../../version';

@Component({
	standalone: false,
	template: ''
})
export class MockComponent {}

describe('ObMasterLayoutComponent', () => {
	let component: ObMasterLayoutComponent;
	let fixture: ComponentFixture<ObMasterLayoutComponent>;
	const mockMasterLayoutService = {
		layout: {
			configEvents$: new Subject<ObIMasterLayoutEvent>(),
			hasCover: false,
			hasLayout: false,
			isMenuOpened: false,
			hasMainNavigation: false,
			hasOffCanvas: false
		},
		header: {configEvents$: new Subject<ObIMasterLayoutEvent>(), isSticky: false},
		footer: {configEvents$: new Subject<ObIMasterLayoutEvent>(), isSticky: false},
		navigation: {refresh: jest.fn()}
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TranslateModule],
			declarations: [ObMasterLayoutComponent],
			providers: [
				provideObliqueTestingConfiguration(),
				provideRouter([{path: 'some/path', component: MockComponent}]),
				{provide: ObMasterLayoutService, useValue: mockMasterLayoutService},
				{provide: ObMasterLayoutConfig, useClass: ObMockMasterLayoutConfig},
				{provide: ObOffCanvasService, useClass: ObMockOffCanvasService},
				{provide: ObGlobalEventsService, useClass: ObMockGlobalEventsService}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	});

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

	describe('initialization', () => {
		describe('with a fragment', () => {
			beforeEach(async () => {
				jest.spyOn(component, 'focusElement');
				const router = TestBed.inject(Router);
				router.initialNavigation();
				await router.navigate(['some/path'], {fragment: 'someFragment', queryParams: {param: 'someParam'}});
			});

			it('should store the current route', () => {
				expect(component.route.path).toBe('/some/path');
			});

			it('should store the current parameters', () => {
				expect(component.route.params).toEqual({param: 'someParam'});
			});

			it('should call focusElement with "someFragment"', () => {
				expect(component.focusElement).toHaveBeenCalledWith('someFragment');
			});
		});

		describe('without fragment', () => {
			beforeEach(async () => {
				jest.spyOn(component, 'focusElement');
				const router = TestBed.inject(Router);
				router.initialNavigation();
				await router.navigate(['some/path'], {queryParams: {param: 'someParam'}});
			});

			it('should store the current route', () => {
				expect(component.route.path).toBe('/some/path');
			});

			it('should store the current parameters', () => {
				expect(component.route.params).toEqual({param: 'someParam'});
			});

			it('should not call focusElement', () => {
				expect(component.focusElement).not.toHaveBeenCalled();
			});
		});
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

		describe('skiplinks', () => {
			it('should defaults to empty array', () => {
				expect(component.skipLinks).toEqual([]);
			});

			describe('with a custom skip link', () => {
				beforeEach(() => {
					component.skipLinks = [{label: 'test', url: ''}];
					component.navigation = [];
				});

				it('should add accessKey 1 if there is no navigation', () => {
					component.noNavigation = true;
					component.ngOnInit();
					expect(component.skipLinks).toEqual([{label: 'test', url: '', accessKey: 1}]);
				});

				describe('with navigation', () => {
					beforeEach(() => {
						component.noNavigation = false;
					});
					it.each([
						{text: 'empty', value: []},
						{text: 'null', value: null},
						{text: 'undefined', value: undefined}
					])('should add accessKey 1 with an $text navigation', ({value}) => {
						component.navigation = value;
						component.ngOnInit();
						expect(component.skipLinks).toEqual([{label: 'test', url: '', accessKey: 1}]);
					});
					it('should add accessKey 2 with non-empty navigation', () => {
						component.navigation = [{label: 'test', url: ''}];
						component.ngOnInit();
						expect(component.skipLinks).toEqual([{label: 'test', url: '', accessKey: 2}]);
					});

					describe('when the navigation is set', () => {
						beforeEach(() => {
							component.navigation = [{label: 'test', url: ''}];
							fixture.detectChanges();
						});
						it('should add accessKey 2', () => {
							expect(component.skipLinks).toEqual([{label: 'test', url: '', accessKey: 2}]);
						});

						it('should refresh the navigation service', () => {
							expect(mockMasterLayoutService.navigation.refresh).toHaveBeenCalled();
						});
					});
				});
			});
		});

		testLayoutProperty('hasCover', 'LAYOUT_HAS_COVER');
		testLayoutProperty('hasLayout', 'LAYOUT_HAS_DEFAULT_LAYOUT');
		testLayoutProperty('isMenuOpened', 'IS_MENU_OPENED');
		testLayoutProperty('hasOffCanvas', 'LAYOUT_HAS_OFF_CANVAS');

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

		describe('isHeaderSticky', () => {
			it('should be defined', () => {
				expect(component.isHeaderSticky).toBe(mockMasterLayoutService.header.isSticky);
			});
			it('should be updated with the service', () => {
				mockMasterLayoutService.header.configEvents$.next({name: ObEMasterLayoutEventValues.HEADER_IS_STICKY, value: true});
				expect(component.isHeaderSticky).toBe(true);
			});
		});

		describe('isFooterSticky', () => {
			it('should be defined', () => {
				expect(component.isFooterSticky).toBe(mockMasterLayoutService.footer.isSticky);
			});
			it('should be updated with the service', () => {
				mockMasterLayoutService.footer.configEvents$.next({name: ObEMasterLayoutEventValues.FOOTER_IS_STICKY, value: true});
				expect(component.isFooterSticky).toBe(true);
			});
		});

		describe('noNavigation', () => {
			it('should be defined', () => {
				expect(component.noNavigation).toBe(true);
			});
			it('should be updated with the service', () => {
				mockMasterLayoutService.layout.configEvents$.next({name: ObEMasterLayoutEventValues.LAYOUT_HAS_MAIN_NAVIGATION, value: true});
				expect(component.noNavigation).toBe(false);
			});
		});

		it('should have a isScrolling property', () => {
			expect(component.isScrolling).toBe(false);
		});
	});

	describe('scrollTop', () => {
		describe('with a scrolled element', () => {
			beforeEach(() => {
				component.scrollTop({scrollTop: 15} as unknown as HTMLElement);
			});

			it('should set isScrolling', () => {
				expect(component.isScrolling).toBe(true);
			});
		});

		describe('with an unscrolled element', () => {
			beforeEach(() => {
				component.scrollTop({scrollTop: 0} as unknown as HTMLElement);
			});

			it('should not set isScrolling', () => {
				expect(component.isScrolling).toBe(false);
			});
		});

		describe('with no element', () => {
			beforeEach(() => {
				component.scrollTop();
			});

			it('should not set isScrolling', () => {
				expect(component.isScrolling).toBe(false);
			});
		});
	});

	describe('focusElement', () => {
		let element: HTMLElement;
		let content: HTMLElement;

		describe('targeting the id "content" when there is no h1 in the page', () => {
			beforeEach(() => {
				element = document.getElementById('content');
				jest.spyOn(element, 'scrollIntoView');
				jest.spyOn(element, 'focus');
				component.focusElement('content');
			});
			it('should scroll to the element', () => {
				expect(element.scrollIntoView).toHaveBeenCalledWith({behavior: 'smooth'});
			});
			it('should focus the element', () => {
				expect(element.focus).toHaveBeenCalledWith({preventScroll: true});
			});
		});

		describe('targeting the id "content" when there is a h1 in the page', () => {
			beforeEach(() => {
				content = document.getElementById('content');
				content.prepend(document.createElement('h1'));
				element = content.querySelector('h1');
				jest.spyOn(element, 'scrollIntoView');
				jest.spyOn(element, 'focus');
				component.focusElement('content');
			});

			it('should scroll to the element', () => {
				expect(element.scrollIntoView).toHaveBeenCalledWith({behavior: 'smooth'});
			});
			it('should focus the element', () => {
				expect(element.focus).toHaveBeenCalledWith({preventScroll: true});
			});
		});

		describe('targeting an id that is corresponding to an non-existing dom element', () => {
			beforeEach(() => {
				content = document.getElementById('content');
				content.innerHTML = '<div></div>';
				element = document.getElementById('content');
				jest.spyOn(element, 'scrollIntoView');
				jest.spyOn(element, 'focus');
				jest.spyOn(global.console, 'error');
				component.focusElement('not_existing_element');
			});
			it('should not scroll to the element', () => {
				expect(element.scrollIntoView).not.toHaveBeenCalled();
			});
			it('should not focus the element', () => {
				expect(element.focus).not.toHaveBeenCalled();
			});
			it('should console.error that the targetted element does not correspond to an existing dom element', () => {
				expect(console.error).toHaveBeenCalledWith('not_existing_element does not correspond to an existing DOM element.');
			});
			afterEach(() => {
				jest.clearAllMocks();
			});
		});
		describe('targeting an id that is corresponding to an existing dom element', () => {
			beforeEach(() => {
				content = document.getElementById('content');
				content.innerHTML = '<input id="not_focusable_element" disabled />';
				element = document.getElementById('not_focusable_element');
				jest.spyOn(element, 'scrollIntoView');
				jest.spyOn(element, 'focus');
				jest.spyOn(global.console, 'info');
				content.focus();
			});
			it('should be first focused on the content element', () => {
				expect(document.activeElement === content).toBe(true);
			});
			it('should scroll to the element', () => {
				component.focusElement('not_focusable_element');
				expect(element.scrollIntoView).toHaveBeenCalledWith({behavior: 'smooth'});
			});

			it('should console.info that the targetted element is not focusable', () => {
				component.focusElement('not_focusable_element');
				expect(console.info).toHaveBeenCalledWith(
					'The element with the id: not_focusable_element is not focusable. Oblique added a tabindex in order to make it focusable.'
				);
			});
			it(`should give it a tabindex="-1" to make it focusable again`, () => {
				component.focusElement('not_focusable_element');
				expect(element.getAttribute('tabindex')).toEqual('-1');
			});
		});

		afterEach(() => {
			jest.clearAllMocks();
		});
	});

	describe('collapse breakpoints', () => {
		it('should have "md" as default collapseBreakpoint', () => {
			expect(component.collapseBreakpoint).toBe('md');
		});

		it.each([
			{property: 'isLayoutExpanded', expected: false},
			{property: 'isLayoutCollapsed', expected: true}
		])('should have "$property" set to "$expected" with non matching media query', ({property, expected}) => {
			Object.defineProperty(window, 'matchMedia', {
				value: jest.fn(() => ({
					matches: false,
					onchange: null,
					addListener: jest.fn(),
					addEventListener: jest.fn(),
					removeEventListener: jest.fn()
				}))
			});
			component.ngOnChanges({
				collapseBreakpoint: {
					previousValue: undefined,
					currentValue: undefined,
					firstChange: false,
					isFirstChange: () => true
				}
			});
			expect(component[property]).toBe(expected);
		});

		it.each([
			{property: 'isLayoutExpanded', expected: true},
			{property: 'isLayoutCollapsed', expected: false}
		])('should have "$property" set to "$expected" with matching media query', ({property, expected}) => {
			Object.defineProperty(window, 'matchMedia', {
				value: jest.fn(() => ({
					matches: true,
					onchange: null,
					addListener: jest.fn(),
					addEventListener: jest.fn(),
					removeEventListener: jest.fn()
				}))
			});
			component.ngOnChanges({
				collapseBreakpoint: {
					previousValue: undefined,
					currentValue: undefined,
					firstChange: false,
					isFirstChange: () => true
				}
			});
			expect(component[property]).toBe(expected);
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
});
