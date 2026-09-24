import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconTestingModule} from '@angular/material/icon/testing';
import {MatTooltip, MatTooltipModule} from '@angular/material/tooltip';
import {By} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router, RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Observable, Subject, isObservable, of} from 'rxjs';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {ObBreadcrumbComponent} from './breadcrumb.component';
import {ObBreadcrumbConfig, ObIBreadcrumb, ObTBreadcrumbConfig} from './breadcrumb.model';
import {ObEllipsisTooltipDirective} from './ellipsis-tooltip.directive';
import {WINDOW} from '../window/window.provider';
import {ObLocalizePipe} from '../router/ob-localize.pipe';

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

describe('ObBreadcrumbComponent', () => {
	let component: ObBreadcrumbComponent;
	let fixture: ComponentFixture<ObBreadcrumbComponent>;

	const mockBreadcrumbConfig: ObBreadcrumbConfig = {
		beautifyUrls: true,
		parameterSeparator: ' - ',
		maxWidth: '4ch',
	};

	const translations = {
		'test.translation-key-param': 'Translated Label with {{param}}',
		'test.translation': 'Translated Label',
	};

	const translateServiceMock = {
		get: jest.fn((key: string) => of(translations[key] ?? key)),
		onLangChange: of({}),
	};

	describe('static routes', () => {
		const staticRouteMock = {
			root: createRoute({
				path: 'path-with-no-label',
				firstChild: createRoute({
					path: '',
					label: 'Skip empty paths',
					firstChild: createRoute({
						path: 'simplepath',
						firstChild: createRoute({
							path: 'path-with-label',
							label: 'Path with Label',
							firstChild: createRoute({
								path: 'double/path',
							}),
						}),
					}),
				}),
			}),
		};

		beforeEach(async () => {
			TestBed.overrideComponent(ObBreadcrumbComponent, {
				remove: {imports: [ObLocalizePipe, TranslatePipe]},
				add: {imports: [ObMockLocalizePipe, ObMockTranslatePipe]},
			});
			await TestBed.configureTestingModule({
				imports: [
					RouterModule.forRoot([{path: '**', component: ObBreadcrumbComponent}]),
					ObBreadcrumbComponent,
					ObMockTranslatePipe,
					RouterTestingModule,
					MatIconTestingModule,
					MatTooltipModule,
					ObMockLocalizePipe,
				],
				providers: [
					{provide: TranslateService, useValue: translateServiceMock},
					{provide: ObTBreadcrumbConfig, useValue: mockBreadcrumbConfig},
					{provide: ActivatedRoute, useValue: staticRouteMock},
					{provide: WINDOW, useValue: window},
				],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(ObBreadcrumbComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should render the expected amount of breadcrumbs', async () => {
			component.ngOnInit();
			await fixture.whenStable();
			const navEl = fixture.debugElement.query(By.css('.ob-breadcrumbs'));
			expect(navEl.children.length).toBe(4);
		});

		it('should beautify the url of a path with no label', () => {
			component.ngOnInit();

			const el = fixture.debugElement.queryAll(By.css('a'))[0];
			expect(el.nativeElement.innerHTML.trim()).toBe('Path With No Label');
		});

		it('should use the label of a path with a label', () => {
			component.ngOnInit();

			const el = fixture.debugElement.queryAll(By.css('a'))[2];
			expect(el.nativeElement.innerHTML.trim()).toBe('Path with Label');
		});

		it('should apply the separator to routes with more than one path', () => {
			component.ngOnInit();

			const el = fixture.debugElement.queryAll(By.css('li'))[3];
			expect(el.nativeElement.textContent).toBe(' Double - Path ');
		});

		it.each([
			[0, '/path-with-no-label'],
			[1, '/path-with-no-label/simplepath'],
			[2, '/path-with-no-label/simplepath/path-with-label'],
		])('should build the url from the routes', (index, expected) => {
			component.ngOnInit();

			const el = fixture.debugElement.queryAll(By.css('a'))[index];
			// NOTE: for un unknown reason, the "https://github.com" part is prepended to the actual URL. This is somewhat related to  https://github.com/angular/angular/blob/master/CHANGELOG.md#router-2
			expect(el.properties.href).toBe(`http://localhost${expected}`);
		});

		it('should create', () => {
			expect(component).toBeTruthy();
		});

		it('should initialize', () => {
			component.ngOnInit();

			expect(component.breadcrumbs$).toBeTruthy();
		});

		it('should prefer explicit inputs over config values', () => {
			fixture.componentRef.setInput('maxWidth', '8ch');
			fixture.componentRef.setInput('parameterSeparator', ' / ');
			fixture.componentRef.setInput('beautifyUrls', false);
			fixture.componentRef.changeDetectorRef.detectChanges();

			expect(component.maxWidth).toBe('8ch');
			expect((component as unknown as {separator: string}).separator).toBe(' / ');
			expect((component as unknown as {beautifyUrls: boolean}).beautifyUrls).toBe(false);
		});

		it('should use config values without explicit inputs', () => {
			expect(component.maxWidth).toBe(mockBreadcrumbConfig.maxWidth);
			expect((component as unknown as {separator: string}).separator).toBe(mockBreadcrumbConfig.parameterSeparator);
			expect((component as unknown as {beautifyUrls: boolean}).beautifyUrls).toBe(mockBreadcrumbConfig.beautifyUrls);
		});

		it('should handle route data without a route config', () => {
			expect(
				(
					component as unknown as {
						getBreadcrumbData: (route: ActivatedRoute) => {path: string; breadCrumbLabel: string};
					}
				).getBreadcrumbData({} as ActivatedRoute)
			).toEqual({path: undefined, breadCrumbLabel: undefined});
		});

		it('should handle missing route data', () => {
			expect(
				(
					component as unknown as {
						getBreadcrumbData: (route: ActivatedRoute) => {path: string; breadCrumbLabel: string};
					}
				).getBreadcrumbData(undefined)
			).toEqual({path: undefined, breadCrumbLabel: undefined});
		});

		it('should handle a route config without breadcrumb data', () => {
			expect(
				(
					component as unknown as {
						getBreadcrumbData: (route: ActivatedRoute) => {path: string; breadCrumbLabel: string};
					}
				).getBreadcrumbData({routeConfig: {path: 'path'}} as ActivatedRoute)
			).toEqual({path: 'path', breadCrumbLabel: undefined});
		});

		it('should skip breadcrumbs without a label', done => {
			(
				component as unknown as {
					createNextBreadcrumb: (
						route: ActivatedRoute,
						next: (parameters: ObIBreadcrumb) => Observable<ObIBreadcrumb[]>,
						url: string,
						label: string,
						pathSplitter: string[]
					) => Observable<ObIBreadcrumb[]>;
				}
			)
				.createNextBreadcrumb(
					{firstChild: null} as ActivatedRoute,
					({label}) => of(label ? [{label, url: ''}] : []),
					'',
					'',
					['']
				)
				.subscribe(crumbs => {
					expect(crumbs).toEqual([]);
					done();
				});
		});

		it('should keep existing crumbs when a parameter has no label value', done => {
			component
				.getCrumbs(
					createRoute({
						path: ':empty',
						params: {empty: ''},
					})
				)
				.subscribe(crumbs => {
					expect(crumbs).toEqual([]);
					done();
				});
		});

		it.each([[[]], [[{label: 'label', url: 'url'} as ObIBreadcrumb]]])(
			'should return crumbs on empty route',
			crumbs => {
				const result = component.getCrumbs(null, crumbs);
				expect(isObservable(result)).toBe(true);

				result.subscribe(crumbList => expect(crumbList).toBe(crumbs));
			}
		);
	});

	describe('dynamic routes', () => {
		const dynamicRouteMock = {
			root: createRoute({
				path: 'path-with-no-label/:param',
				params: {param: 'param-value-1'},
				firstChild: createRoute({
					path: ':param-only',
					params: {'param-only': 'param-value-2'},
					firstChild: createRoute({
						path: 'path-with-label/:param',
						label: 'Path with Label and the value {{param}}',
						params: {param: 'My Value'},
						firstChild: createRoute({
							path: 'path-with-label/:param',
							label: 'Static Label',
							params: {param: 'My Value'},
							firstChild: createRoute({
								path: 'double/path',
							}),
						}),
					}),
				}),
			}),
		};

		beforeEach(async () => {
			TestBed.overrideComponent(ObBreadcrumbComponent, {
				remove: {imports: [ObLocalizePipe, TranslatePipe]},
				add: {imports: [ObMockLocalizePipe, ObMockTranslatePipe]},
			});
			await TestBed.configureTestingModule({
				imports: [
					ObBreadcrumbComponent,
					ObMockTranslatePipe,
					RouterTestingModule,
					MatIconTestingModule,
					MatTooltipModule,
					ObMockLocalizePipe,
				],
				providers: [
					{provide: TranslateService, useValue: translateServiceMock},
					{provide: ObTBreadcrumbConfig, useValue: mockBreadcrumbConfig},
					{provide: ActivatedRoute, useValue: dynamicRouteMock},
					{provide: WINDOW, useValue: window},
				],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(ObBreadcrumbComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should render the expected amount of breadcrumbs', async () => {
			component.ngOnInit();
			await fixture.whenStable();
			const navEl = fixture.debugElement.query(By.css('.ob-breadcrumbs'));
			expect(navEl.children.length).toBe(5);
		});

		it('should beautify the url of a path with no label and a param', () => {
			component.ngOnInit();

			const el = fixture.debugElement.queryAll(By.css('a'))[0];
			expect(el.nativeElement.innerHTML.trim()).toBe('Path With No Label - Param Value 1');
		});

		it('should use the param value as label', () => {
			component.ngOnInit();

			const el = fixture.debugElement.queryAll(By.css('a'))[1];
			expect(el.nativeElement.innerHTML.trim()).toBe('Param Value 2');
		});

		it('should apply the param to the label', () => {
			component.ngOnInit();

			const el = fixture.debugElement.queryAll(By.css('a'))[2];
			expect(el.nativeElement.textContent.trim()).toBe('Path with Label and the value My Value');
		});

		it('should ignore the param if a static label is provided', () => {
			component.ngOnInit();

			const el = fixture.debugElement.queryAll(By.css('a'))[3];
			expect(el.nativeElement.textContent.trim()).toBe('Static Label');
		});

		it.each([
			[0, '/path-with-no-label/param-value-1'],
			[1, '/path-with-no-label/param-value-1/param-value-2'],
		])('should build the url from the routes', (index, expected) => {
			component.ngOnInit();

			const el = fixture.debugElement.queryAll(By.css('a'))[index];
			// NOTE: for un unknown reason, the "https://github.com" part is prepended to the actual URL. This is somewhat related to  https://github.com/angular/angular/blob/master/CHANGELOG.md#router-2
			expect(el.properties.href).toBe(`http://localhost${expected}`);
		});
	});

	describe('translated routes', () => {
		const dynamicRouteMock = {
			root: createRoute({
				path: 'path-with-no-label/:param',
				label: 'test.translation-key-param',
				params: {param: 'param-value-1'},
				firstChild: createRoute({
					path: ':param-only',
					params: {'param-only': 'param-value-2'},
					label: 'test.translation',
					firstChild: createRoute({
						path: 'placeholder',
					}),
				}),
			}),
		};

		beforeEach(async () => {
			TestBed.overrideComponent(ObBreadcrumbComponent, {
				remove: {imports: [ObLocalizePipe, TranslatePipe]},
				add: {imports: [ObMockLocalizePipe, ObMockTranslatePipe]},
			});
			await TestBed.configureTestingModule({
				imports: [
					ObBreadcrumbComponent,
					ObMockTranslatePipe,
					RouterModule.forRoot([{path: '**', component: ObBreadcrumbComponent}]),
					MatIconTestingModule,
					MatTooltipModule,
					ObEllipsisTooltipDirective,
					ObMockLocalizePipe,
				],
				providers: [
					{provide: TranslateService, useValue: translateServiceMock},
					{provide: ObTBreadcrumbConfig, useValue: mockBreadcrumbConfig},
					{provide: ActivatedRoute, useValue: dynamicRouteMock},
					{provide: WINDOW, useValue: window},
				],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(ObBreadcrumbComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should render the expected amount of breadcrumbs', async () => {
			component.ngOnInit();
			await fixture.whenStable();
			const navEl = fixture.debugElement.query(By.css('.ob-breadcrumbs'));
			expect(navEl.children.length).toBe(3);
		});

		it('should translate a label and replace params', () => {
			component.ngOnInit();

			const el = fixture.debugElement.queryAll(By.css('a'))[0];
			expect(el.nativeElement.innerHTML.trim()).toBe('Translated Label with Param Value 1');
		});

		it('should translate a label and ignore params', () => {
			component.ngOnInit();

			const el = fixture.debugElement.queryAll(By.css('a'))[1];
			expect(el.nativeElement.innerHTML.trim()).toBe('Translated Label');
		});
	});

	describe('other config options', () => {
		const dynamicRouteMock = {
			root: createRoute({
				path: 'path-with-no-label/:param',
				label: 'test.translation-key-param',
				params: {param: 'param-value-1'},
				firstChild: createRoute({
					path: 'double/path',
					firstChild: createRoute({
						path: 'some-path',
						firstChild: createRoute({
							path: 'placeholder',
						}),
					}),
				}),
			}),
		};

		beforeEach(async () => {
			TestBed.overrideComponent(ObBreadcrumbComponent, {
				remove: {imports: [ObLocalizePipe, TranslatePipe]},
				add: {imports: [ObMockLocalizePipe, ObMockTranslatePipe]},
			});
			await TestBed.configureTestingModule({
				imports: [
					ObBreadcrumbComponent,
					ObMockTranslatePipe,
					RouterModule,
					MatIconTestingModule,
					MatTooltipModule,
					ObEllipsisTooltipDirective,
					ObMockLocalizePipe,
				],
				providers: [
					{provide: TranslateService, useValue: translateServiceMock},
					{
						provide: ObTBreadcrumbConfig,
						useValue: {parameterSeparator: '/'},
					},
					{provide: WINDOW, useValue: window},
					{provide: ActivatedRoute, useValue: dynamicRouteMock},
				],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(ObBreadcrumbComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should translate a label and replace params, but not beautify them', () => {
			component.ngOnInit();

			const el = fixture.debugElement.queryAll(By.css('a'))[0];
			expect(el.nativeElement.innerHTML.trim()).toBe('Translated Label with param-value-1');
		});

		it('should use the defined separator', () => {
			component.ngOnInit();

			const el = fixture.debugElement.queryAll(By.css('a'))[1];
			expect(el.nativeElement.innerHTML.trim()).toBe('double/path');
		});

		it('should use the path as label', () => {
			component.ngOnInit();

			const el = fixture.debugElement.queryAll(By.css('a'))[2];
			expect(el.nativeElement.innerHTML.trim()).toBe('some-path');
		});

		describe('ellipsis tooltip usage', () => {
			const getLabelElements = (): HTMLElement[] => {
				return fixture.debugElement.queryAll(By.css('.ob-breadcrumb-label')).map(de => de.nativeElement as HTMLElement);
			};

			const getTooltips = (): MatTooltip[] =>
				fixture.debugElement.queryAll(By.directive(ObEllipsisTooltipDirective)).map(de => de.injector.get(MatTooltip));

			it('should attach one tooltip to each breadcrumb label', () => {
				const labels = getLabelElements();
				const tooltips = getTooltips();

				expect(tooltips.length).toBe(labels.length);
			});

			describe.each([
				['ellipsed', 40, 100, false],
				['not ellipsed', 120, 100, true],
			])('when the text is %s', (stateLabel: string, width: number, scroll: number, expectedDisabled: boolean) => {
				test(`should set disabled=${expectedDisabled} for all tooltips when text is ${stateLabel}`, async () => {
					const labels = getLabelElements();

					for (const el of labels) {
						Object.defineProperty(el, 'offsetWidth', {value: width, configurable: true});
						Object.defineProperty(el, 'scrollWidth', {value: scroll, configurable: true});
					}

					window.dispatchEvent(new Event('resize'));
					fixture.componentRef.changeDetectorRef.detectChanges();
					await fixture.whenStable();

					const disabledStates = getTooltips().map(tooltip => tooltip.disabled);

					expect(disabledStates.every(state => state === expectedDisabled)).toBe(true);
				});
			});

			it('should toggle tooltip disabled state for each tooltip when text changes from ellipsed to not ellipsed', async () => {
				const labels = getLabelElements();

				// start with ellipsed texts
				for (const el of labels) {
					Object.defineProperty(el, 'offsetWidth', {value: 40, configurable: true});
					Object.defineProperty(el, 'scrollWidth', {value: 120, configurable: true});
				}

				window.dispatchEvent(new Event('resize'));
				fixture.componentRef.changeDetectorRef.detectChanges();
				await fixture.whenStable();

				const disabledStates = getTooltips().map(tooltip => tooltip.disabled);

				// all enabled when ellipsed
				expect(disabledStates.every(state => state === false)).toBe(true);
			});

			it('should keep tooltips disabled when text is not ellipsed', async () => {
				const labels = getLabelElements();

				for (const el of labels) {
					Object.defineProperty(el, 'offsetWidth', {value: 120, configurable: true});
					Object.defineProperty(el, 'scrollWidth', {value: 100, configurable: true});
				}

				window.dispatchEvent(new Event('resize'));
				fixture.componentRef.changeDetectorRef.detectChanges();
				await fixture.whenStable();

				const disabledStates = getTooltips().map(tooltip => tooltip.disabled);

				expect(disabledStates.every(state => state === true)).toBe(true);
			});
		});
	});

	describe('router events', () => {
		let routerEvents: Subject<unknown>;

		beforeEach(async () => {
			routerEvents = new Subject<unknown>();
			TestBed.overrideComponent(ObBreadcrumbComponent, {
				remove: {imports: [ObLocalizePipe, TranslatePipe]},
				add: {imports: [ObMockLocalizePipe, ObMockTranslatePipe]},
			});
			await TestBed.configureTestingModule({
				imports: [ObBreadcrumbComponent, ObMockTranslatePipe, ObMockLocalizePipe],
				providers: [
					{provide: TranslateService, useValue: {...translateServiceMock, onLangChange: new Subject()}},
					{provide: ActivatedRoute, useValue: {root: null}},
					{provide: Router, useValue: {events: routerEvents}},
					{provide: WINDOW, useValue: window},
				],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
			}).compileComponents();
			fixture = TestBed.createComponent(ObBreadcrumbComponent);
			component = fixture.componentInstance;
		});

		it('should ignore router events that are not NavigationEnd events', () => {
			const observer = jest.fn();
			component.ngOnInit();
			component.breadcrumbs$.subscribe(observer);

			routerEvents.next({});

			expect(observer).toHaveBeenCalledTimes(1);
		});

		it('should have no config fallbacks without breadcrumb config', () => {
			expect(component.maxWidth).toBeUndefined();
			expect((component as unknown as {separator: string}).separator).toBe('');
			expect((component as unknown as {beautifyUrls: boolean}).beautifyUrls).toBe(false);
		});

		it('should react to NavigationEnd events', () => {
			const observer = jest.fn();
			component.ngOnInit();
			component.breadcrumbs$.subscribe(observer);

			routerEvents.next(new NavigationEnd(1, '/test', '/test'));

			expect(observer).toHaveBeenCalledTimes(2);
		});
	});
});

function createRoute({
	path,
	label,
	params,
	firstChild,
}: {
	path: string;
	label?: string;
	firstChild?: any;
	params?: Record<string, string>;
}): {
	routeConfig: {path: string; data: {breadcrumb: string}};
	snapshot: {params: Record<string, string>};
	firstChild: any;
} {
	return {
		routeConfig: {
			path,
			data: {breadcrumb: label},
		},
		snapshot: {
			params,
		},
		firstChild,
	};
}
