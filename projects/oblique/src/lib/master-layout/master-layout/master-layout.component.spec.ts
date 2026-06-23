import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, Pipe, PipeTransform} from '@angular/core';
import {Router, provideRouter} from '@angular/router';
import {HighContrastMode, HighContrastModeDetector} from '@angular/cdk/a11y';
import {TranslateModule} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {provideObliqueTestingConfiguration} from '../../utilities';
import {ObMockGlobalEventsService} from '../../global-events/_mocks/mock-global-events.service';
import {ObMasterLayoutComponent} from './master-layout.component';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {ObMockMasterLayoutConfig} from '../_mocks/mock-master-layout.config';
import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObOffCanvasService} from '../../off-canvas/off-canvas.service';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent, ObINavigationLink} from '../master-layout.model';
import {appVersion} from '../../version';
import {ObConsoleService} from '../../console/ob-console.service';

@Component({
	standalone: false,
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class MockComponent {}

@Pipe({
	name: 'obLocalize',
})
export class ObMockLocalizePipe implements PipeTransform {
	transform(route: string | string[] | null | undefined): string | null | undefined {
		if (route === null) {
			return null;
		}
		if (route === undefined) {
			return undefined;
		}
		return typeof route === 'string' ? route : route.join('/');
	}
}

describe('ObMasterLayoutComponent', () => {
	let component: ObMasterLayoutComponent;
	let fixture: ComponentFixture<ObMasterLayoutComponent>;
	let offCanvasOpened$: Subject<boolean>;
	const mockMasterLayoutService = {
		layout: {
			configEvents$: new Subject<ObIMasterLayoutEvent>(),
			hasCover: false,
			hasLayout: false,
			hasMaxWidth: false,
			isMenuOpened: false,
			hasMainNavigation: false,
			hasOffCanvas: false,
		},
		header: {configEvents$: new Subject<ObIMasterLayoutEvent>(), isSticky: false},
		footer: {configEvents$: new Subject<ObIMasterLayoutEvent>(), isSticky: false},
		navigation: {refresh: jest.fn()},
	};
	let obConsoleService: ObConsoleService;

	beforeEach(async () => {
		offCanvasOpened$ = new Subject<boolean>();
		await TestBed.configureTestingModule({
			imports: [TranslateModule, ObMockLocalizePipe],
			declarations: [ObMasterLayoutComponent],
			providers: [
				provideObliqueTestingConfiguration(),
				provideRouter([
					{path: 'some/path', component: MockComponent},
					{path: 'some/path2', component: MockComponent},
				]),
				{provide: ObMasterLayoutService, useValue: mockMasterLayoutService},
				{provide: ObMasterLayoutConfig, useClass: ObMockMasterLayoutConfig},
				{provide: ObOffCanvasService, useValue: {opened$: offCanvasOpened$}},
				{provide: ObGlobalEventsService, useClass: ObMockGlobalEventsService},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		mockMasterLayoutService.header.isSticky = false;
		mockMasterLayoutService.footer.isSticky = false;
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
		describe('focusMainAfterNavigation', () => {
			it('should focus main content only from the second NavigationEnd event', async () => {
				jest.spyOn(component, 'focusElementById');
				const router = TestBed.inject(Router);
				router.initialNavigation();

				await router.navigate(['some/path']);
				expect(component.focusElementById).not.toHaveBeenCalled();

				await router.navigate(['some/path2']);
				expect(component.focusElementById).toHaveBeenCalledWith(component.contentId);
			});
		});

		describe('with a fragment', () => {
			beforeEach(async () => {
				jest.spyOn(component, 'focusElementById');
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

			it('should call focusElementById with "someFragment"', () => {
				expect(component.focusElementById).toHaveBeenCalledWith('someFragment');
			});
		});

		describe('without fragment', () => {
			beforeEach(async () => {
				jest.spyOn(component, 'focusElementById');
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

			it('should not call focusElementById', () => {
				expect(component.focusElementById).not.toHaveBeenCalled();
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
			expect(component.navigation()).toEqual([]);
		});

		describe('skiplinks', () => {
			it('should defaults to empty array', () => {
				expect(component.skipLinks()).toEqual([]);
			});

			describe('with a custom skip link', () => {
				beforeEach(() => {
					fixture.componentRef.setInput('skipLinks', [{label: 'test', url: ''}]);
					fixture.componentRef.setInput('navigation', []);
					fixture.detectChanges();
				});

				it('should add accessKey 1 if there is no navigation', () => {
					component.noNavigation = true;
					component.ngOnInit();
					expect(component.skipLinksInternal).toEqual([{label: 'test', url: '', accessKey: 1}]);
				});

				describe('with navigation', () => {
					beforeEach(() => {
						component.noNavigation = false;
					});
					it.each([
						{text: 'empty', value: []},
						{text: 'null', value: null},
						{text: 'undefined', value: undefined},
					])('should add accessKey 1 with an $text navigation', ({value}) => {
						fixture.componentRef.setInput('navigation', value);
						component.ngOnInit();
						expect(component.skipLinksInternal).toEqual([{label: 'test', url: '', accessKey: 1}]);
					});
					it('should add accessKey 2 with non-empty navigation', () => {
						fixture.componentRef.setInput('navigation', [{label: 'test', url: ''}]);
						component.ngOnInit();
						expect(component.skipLinksInternal).toEqual([{label: 'test', url: '', accessKey: 2}]);
					});

					describe('when the navigation is set', () => {
						beforeEach(() => {
							fixture.componentRef.setInput('navigation', [{label: 'test', url: ''}]);
							fixture.componentRef.changeDetectorRef.detectChanges();
						});
						it('should add accessKey 2', () => {
							expect(component.skipLinksInternal).toEqual([{label: 'test', url: '', accessKey: 2}]);
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
		testLayoutProperty('hasMaxWidth', 'LAYOUT_HAS_MAX_WIDTH');
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
				mockMasterLayoutService.header.configEvents$.next({
					name: ObEMasterLayoutEventValues.HEADER_IS_STICKY,
					value: true,
				});
				expect(component.isHeaderSticky).toBe(true);
			});
		});

		describe('isFooterSticky', () => {
			it('should be defined', () => {
				expect(component.isFooterSticky).toBe(mockMasterLayoutService.footer.isSticky);
			});
			it('should be updated with the service', () => {
				mockMasterLayoutService.footer.configEvents$.next({
					name: ObEMasterLayoutEventValues.FOOTER_IS_STICKY,
					value: true,
				});
				expect(component.isFooterSticky).toBe(true);
			});
		});

		describe('noNavigation', () => {
			it('should be defined', () => {
				expect(component.noNavigation).toBe(true);
			});
			it('should be updated with the service', () => {
				mockMasterLayoutService.layout.configEvents$.next({
					name: ObEMasterLayoutEventValues.LAYOUT_HAS_MAIN_NAVIGATION,
					value: true,
				});
				expect(component.noNavigation).toBe(false);
			});
		});

		it('should have a isScrolling property', () => {
			expect(component.isScrolling).toBe(false);
		});

		it('should ignore unchanged navigation length', () => {
			fixture.componentRef.setInput('navigation', []);
			component.ngDoCheck();
			jest.clearAllMocks();

			component.ngDoCheck();

			expect(mockMasterLayoutService.navigation.refresh).not.toHaveBeenCalled();
		});

		it('should handle missing navigation', () => {
			Object.defineProperty(component, 'navigation', {configurable: true, value: undefined});

			expect(() => component.ngDoCheck()).toThrow();
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

		describe.each([
			{
				property: 'pageYOffset',
				setup: () => Object.defineProperty(window, 'pageYOffset', {configurable: true, value: 15}),
			},
			{
				property: 'documentElement.scrollTop',
				setup: () => {
					Object.defineProperty(window, 'pageYOffset', {configurable: true, value: 0});
					Object.defineProperty(document.documentElement, 'scrollTop', {configurable: true, value: 15});
				},
			},
			{
				property: 'body.scrollTop',
				setup: () => {
					Object.defineProperty(window, 'pageYOffset', {configurable: true, value: 0});
					Object.defineProperty(document.documentElement, 'scrollTop', {configurable: true, value: 0});
					Object.defineProperty(document.body, 'scrollTop', {configurable: true, value: 15});
				},
			},
		])('with $property', ({setup}) => {
			beforeEach(() => {
				setup();
				component.scrollTop();
			});

			afterEach(() => {
				Object.defineProperty(window, 'pageYOffset', {configurable: true, value: 0});
				Object.defineProperty(document.documentElement, 'scrollTop', {configurable: true, value: 0});
				Object.defineProperty(document.body, 'scrollTop', {configurable: true, value: 0});
			});

			it('should set isScrolling', () => {
				expect(component.isScrolling).toBe(true);
			});
		});
	});

	describe('high contrast mode', () => {
		it('should detect white on black mode', () => {
			fixture.destroy();
			jest
				.spyOn(TestBed.inject(HighContrastModeDetector), 'getHighContrastMode')
				.mockReturnValue(HighContrastMode.WHITE_ON_BLACK);
			fixture = TestBed.createComponent(ObMasterLayoutComponent);
			component = fixture.componentInstance;

			fixture.detectChanges();

			expect(component.hasHighContrast).toBe(true);
		});
	});

	describe('focusElementById', () => {
		let element: HTMLElement;
		let content: HTMLElement;

		const recreateComponentWithStickyState = (isFooterSticky: boolean, isHeaderSticky: boolean): void => {
			fixture.destroy();
			mockMasterLayoutService.footer.isSticky = isFooterSticky;
			mockMasterLayoutService.header.isSticky = isHeaderSticky;
			fixture = TestBed.createComponent(ObMasterLayoutComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		};

		describe.each([
			{desc: 'neither header nor footer is sticky', isFooterSticky: false, isHeaderSticky: false},
			{desc: 'only footer is sticky', isFooterSticky: true, isHeaderSticky: false},
			{desc: 'only header is sticky', isFooterSticky: false, isHeaderSticky: true},
		])('targeting the id "content" when $desc', ({isFooterSticky, isHeaderSticky}) => {
			beforeEach(() => {
				recreateComponentWithStickyState(isFooterSticky, isHeaderSticky);
				element = document.getElementById('content');
				jest.spyOn(element, 'scrollIntoView');
				jest.spyOn(element, 'focus');
				component.focusElementById('content');
			});
			it('should scroll to the element', () => {
				expect(element.scrollIntoView).toHaveBeenCalledWith({behavior: 'smooth'});
			});
			it('should focus the element', () => {
				expect(element.focus).toHaveBeenCalledWith({preventScroll: true});
			});
		});

		describe('targeting the id "content" when both the header and footer are sticky', () => {
			beforeEach(() => {
				recreateComponentWithStickyState(true, true);

				element = document.getElementById('content');
				// scrollTo is not defined in jsdom
				Object.defineProperty(element, 'scrollTo', {
					value: jest.fn(),
					writable: true,
				});
				jest.spyOn(element, 'scrollTo');
				jest.spyOn(element, 'focus');
				component.focusElementById('content');
			});
			it('should scroll within the containing element', () => {
				expect(element.scrollTo).toHaveBeenCalledWith({behavior: 'smooth', top: 0});
			});
			it('should focus the element', () => {
				expect(element.focus).toHaveBeenCalledWith({preventScroll: true});
			});
		});

		describe('with prefersReducedMotion false', () => {
			beforeEach(() => {
				element = document.getElementById('content');
				jest.spyOn(element, 'scrollIntoView');
				jest.spyOn(element, 'focus');
				component.prefersReducedMotion = false;
				component.focusElementById('content');
			});

			it('should scroll to the element', () => {
				expect(element.scrollIntoView).toHaveBeenCalledWith({behavior: 'smooth'});
			});
		});

		describe('targeting an id that is corresponding to an non-existing dom element', () => {
			beforeEach(() => {
				content = document.getElementById('content');
				content.innerHTML = '<div></div>';
				element = document.getElementById('content');
				jest.spyOn(element, 'scrollIntoView');
				jest.spyOn(element, 'focus');
				obConsoleService = TestBed.inject(ObConsoleService);
				jest.spyOn(obConsoleService, 'error');
				component.focusElementById('not_existing_element');
			});
			it('should not scroll to the element', () => {
				expect(element.scrollIntoView).not.toHaveBeenCalled();
			});
			it('should not focus the element', () => {
				expect(element.focus).not.toHaveBeenCalled();
			});
			it('should console.error that the targeted element does not correspond to an existing dom element', () => {
				expect(obConsoleService.error).toHaveBeenCalledWith(
					'ObMasterLayoutComponent focusElementById() !(element instanceof Element)',
					'not_existing_element does not correspond to an existing DOM element.'
				);
			});
			afterEach(() => {
				jest.clearAllMocks();
			});
		});
		describe('targeting an id that is corresponding to an existing dom element', () => {
			beforeEach(() => {
				content = document.getElementById('content');
				content.innerHTML = '<input id="not_focusable_element" class="foo bar" disabled />';
				element = document.getElementById('not_focusable_element');
				jest.spyOn(element, 'scrollIntoView');
				jest.spyOn(element, 'focus');
				obConsoleService = TestBed.inject(ObConsoleService);
				jest.spyOn(obConsoleService, 'info');
				content.focus();
			});
			it('should be first focused on the content element', () => {
				expect(document.activeElement === content).toBe(true);
			});
			it('should scroll to the element', () => {
				component.focusElementById('not_focusable_element');
				expect(element.scrollIntoView).toHaveBeenCalledWith({behavior: 'smooth'});
			});

			it('should console.info that the targetted element is not focusable', () => {
				component.focusElementById('not_focusable_element');
				expect(obConsoleService.info).toHaveBeenCalledWith(
					'ObMasterLayoutComponent focusElementById() (document.activeElement !== element)',
					'The element: input#not_focusable_element.foo.bar is not focusable. Oblique added a tabindex in order to make it focusable.'
				);
			});
			it(`should give it a tabindex="-1" to make it focusable again`, () => {
				component.focusElementById('not_focusable_element');
				expect(element.getAttribute('tabindex')).toEqual('-1');
			});
		});

		describe('targeting a non-focusable element outside dev mode', () => {
			let previousNgDevMode: unknown;

			beforeEach(() => {
				previousNgDevMode = (globalThis as unknown as {ngDevMode?: unknown}).ngDevMode;
				(globalThis as unknown as {ngDevMode?: unknown}).ngDevMode = false;
				content = document.getElementById('content');
				content.innerHTML = '<input id="not_focusable_without_dev_mode" disabled />';
				element = document.getElementById('not_focusable_without_dev_mode');
				jest.spyOn(element, 'scrollIntoView');
				jest.spyOn(element, 'focus');
				jest.spyOn(global.console, 'info');
			});

			afterEach(() => {
				(globalThis as unknown as {ngDevMode?: unknown}).ngDevMode = previousNgDevMode;
			});

			it('should not log focusability information', () => {
				component.focusElementById('not_focusable_without_dev_mode');

				expect(console.info).not.toHaveBeenCalled();
			});
		});

		afterEach(() => {
			jest.clearAllMocks();
		});
	});

	describe('route helpers', () => {
		it('should extract an empty path from an empty url', () => {
			expect(
				(component as unknown as {extractUrlPart: (url: string, regex: RegExp) => string}).extractUrlPart(
					'',
					/^[^?&#]*/
				)
			).toBe('');
		});

		it('should return undefined query parameters without parameters', () => {
			expect(
				(component as unknown as {formatQueryParameters: (parameters: string) => unknown}).formatQueryParameters(
					undefined
				)
			).toBeUndefined();
		});

		it('should fall back to an undefined path without a route match', async () => {
			const originalExec = RegExp.prototype.exec;
			const exec = jest.spyOn(RegExp.prototype, 'exec').mockImplementation(function (url: string) {
				return this.source === '^[^?&#]*' ? null : originalExec.call(this, url);
			});

			try {
				await TestBed.inject(Router).navigate(['some/path']);

				expect(component.route.path).toBeUndefined();
			} finally {
				exec.mockRestore();
			}
		});
	});

	describe('collapse breakpoints', () => {
		it('should have "md" as default collapseBreakpoint', () => {
			expect(component.collapseBreakpoint).toBe('md');
		});

		it.each([
			{property: 'isLayoutExpanded', expected: false},
			{property: 'isLayoutCollapsed', expected: true},
		])('should have "$property" set to "$expected" with non matching media query', ({property, expected}) => {
			Object.defineProperty(window, 'matchMedia', {
				value: jest.fn(() => ({
					matches: false,
					onchange: null,
					addListener: jest.fn(),
					addEventListener: jest.fn(),
					removeEventListener: jest.fn(),
				})),
			});
			component.ngOnChanges({
				collapseBreakpoint: {
					previousValue: undefined,
					currentValue: undefined,
					firstChange: false,
					isFirstChange: () => true,
				},
			});
			expect(component[property]).toBe(expected);
		});

		it('should react to media query changes', () => {
			let changeHandler: (event: MediaQueryListEvent) => void;
			Object.defineProperty(window, 'matchMedia', {
				value: jest.fn(() => ({
					matches: false,
					onchange: null,
					addListener: jest.fn(),
					addEventListener: jest.fn((type: string, handler: (event: MediaQueryListEvent) => void) => {
						expect(type).toBe('change');
						changeHandler = handler;
					}),
					removeEventListener: jest.fn(),
				})),
			});

			component.ngOnChanges({
				collapseBreakpoint: {
					previousValue: undefined,
					currentValue: 'md',
					firstChange: false,
					isFirstChange: () => false,
				},
			});
			changeHandler({matches: true} as MediaQueryListEvent);

			expect(component.isLayoutExpanded).toBe(true);
			expect(component.isLayoutCollapsed).toBe(false);
		});

		it.each([
			{property: 'isLayoutExpanded', expected: true},
			{property: 'isLayoutCollapsed', expected: false},
		])('should have "$property" set to "$expected" with matching media query', ({property, expected}) => {
			Object.defineProperty(window, 'matchMedia', {
				value: jest.fn(() => ({
					matches: true,
					onchange: null,
					addListener: jest.fn(),
					addEventListener: jest.fn(),
					removeEventListener: jest.fn(),
				})),
			});
			component.ngOnChanges({
				collapseBreakpoint: {
					previousValue: undefined,
					currentValue: undefined,
					firstChange: false,
					isFirstChange: () => true,
				},
			});
			expect(component[property]).toBe(expected);
		});

		it('should ignore changes without collapseBreakpoint', () => {
			expect(() => component.ngOnChanges({})).not.toThrow();
		});

		it('should keep an explicitly configured collapseBreakpoint on init', () => {
			fixture.destroy();
			fixture = TestBed.createComponent(ObMasterLayoutComponent);
			component = fixture.componentInstance;
			component.collapseBreakpoint = 'lg';

			fixture.detectChanges();

			expect(component.collapseBreakpoint).toBe('lg');
		});
	});

	describe('off canvas close button', () => {
		afterEach(() => {
			jest.useRealTimers();
		});

		it('should focus the close button when the off canvas opens', () => {
			jest.useFakeTimers();
			fixture.destroy();
			fixture = TestBed.createComponent(ObMasterLayoutComponent);
			component = fixture.componentInstance;
			component.hasOffCanvas = true;
			fixture.detectChanges();
			const focus = jest.spyOn(component.offCanvasClose().nativeElement, 'focus');

			offCanvasOpened$.next(true);
			jest.advanceTimersByTime(600);

			expect(focus).toHaveBeenCalled();
		});

		it('should not focus the close button when the off canvas closes', () => {
			jest.useFakeTimers();
			fixture.destroy();
			fixture = TestBed.createComponent(ObMasterLayoutComponent);
			component = fixture.componentInstance;
			component.hasOffCanvas = true;
			fixture.detectChanges();
			const focus = jest.spyOn(component.offCanvasClose().nativeElement, 'focus');

			offCanvasOpened$.next(false);
			jest.advanceTimersByTime(600);

			expect(focus).not.toHaveBeenCalled();
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
