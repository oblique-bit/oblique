import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MatIconTestingModule} from '@angular/material/icon/testing';
import {MatTooltipModule} from '@angular/material/tooltip';
import {By} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {isObservable, of} from 'rxjs';
import {ObMockIconModule} from '../icon/_mocks/mock-icon.module';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {ObBreadcrumbComponent} from './breadcrumb.component';
import {ObBreadcrumbConfig, ObIBreadcrumb, ObTBreadcrumbConfig} from './breadcrumb.model';

describe('ObBreadcrumbComponent', () => {
	let component: ObBreadcrumbComponent;
	let fixture: ComponentFixture<ObBreadcrumbComponent>;

	const mockBreadcrumbConfig: ObBreadcrumbConfig = {
		beautifyUrls: true,
		parameterSeparator: ' - ',
		maxWidth: '4ch'
	};

	const translateServiceMock = {
		get: jest.fn((key: string) => of(key.includes('param') ? 'Translated Label with :param' : 'Translated Label')),
		onLangChange: of({})
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
								path: 'double/path'
							})
						})
					})
				})
			})
		};

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				declarations: [ObBreadcrumbComponent],
				imports: [ObMockTranslatePipe, RouterTestingModule, ObMockIconModule, MatIconTestingModule, MatTooltipModule],
				providers: [
					{provide: TranslateService, useValue: translateServiceMock},
					{provide: ObTBreadcrumbConfig, useValue: mockBreadcrumbConfig},
					{provide: ActivatedRoute, useValue: staticRouteMock}
				],
				schemas: [CUSTOM_ELEMENTS_SCHEMA]
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(ObBreadcrumbComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should render the expected amount of breadcrumbs', waitForAsync(() => {
			component.ngOnInit();
			fixture.whenStable().then(() => {
				const navEl = fixture.debugElement.query(By.css('.ob-breadcrumbs'));
				expect(navEl.children.length).toBe(4);
			});
		}));

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
			expect(el.nativeElement.textContent).toBe('Double - Path');
		});

		it.each([
			[0, '/path-with-no-label'],
			[1, '/path-with-no-label/simplepath'],
			[2, '/path-with-no-label/simplepath/path-with-label']
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

		it.each([[[]], [[{label: 'label', url: 'url'} as ObIBreadcrumb]]])('should return crumbs on empty route', crumbs => {
			const result = component.getCrumbs(null, crumbs);
			expect(isObservable(result)).toBe(true);

			result.subscribe(crumbList => expect(crumbList).toBe(crumbs));
		});
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
						label: 'Path with Label and the value :param',
						params: {param: 'My Value'},
						firstChild: createRoute({
							path: 'path-with-label/:param',
							label: 'Static Label',
							params: {param: 'My Value'},
							firstChild: createRoute({
								path: 'double/path'
							})
						})
					})
				})
			})
		};

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				declarations: [ObBreadcrumbComponent],
				imports: [ObMockTranslatePipe, RouterTestingModule, ObMockIconModule, MatIconTestingModule, MatTooltipModule],
				providers: [
					{provide: TranslateService, useValue: translateServiceMock},
					{provide: ObTBreadcrumbConfig, useValue: mockBreadcrumbConfig},
					{provide: ActivatedRoute, useValue: dynamicRouteMock}
				],
				schemas: [CUSTOM_ELEMENTS_SCHEMA]
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(ObBreadcrumbComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should render the expected amount of breadcrumbs', waitForAsync(() => {
			component.ngOnInit();
			fixture.whenStable().then(() => {
				const navEl = fixture.debugElement.query(By.css('.ob-breadcrumbs'));
				expect(navEl.children.length).toBe(5);
			});
		}));

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
			[1, '/path-with-no-label/param-value-1/param-value-2']
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
				label: 'i18n.translation-key-param',
				params: {param: 'param-value-1'},
				firstChild: createRoute({
					path: ':param-only',
					params: {'param-only': 'param-value-2'},
					label: 'i18n.translation',
					firstChild: createRoute({
						path: 'placeholder'
					})
				})
			})
		};

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				declarations: [ObBreadcrumbComponent],
				imports: [ObMockTranslatePipe, RouterTestingModule, ObMockIconModule, MatIconTestingModule, MatTooltipModule],
				providers: [
					{provide: TranslateService, useValue: translateServiceMock},
					{provide: ObTBreadcrumbConfig, useValue: mockBreadcrumbConfig},
					{provide: ActivatedRoute, useValue: dynamicRouteMock}
				],
				schemas: [CUSTOM_ELEMENTS_SCHEMA]
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(ObBreadcrumbComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should render the expected amount of breadcrumbs', waitForAsync(() => {
			component.ngOnInit();
			fixture.whenStable().then(() => {
				const navEl = fixture.debugElement.query(By.css('.ob-breadcrumbs'));
				expect(navEl.children.length).toBe(3);
			});
		}));

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
				label: 'i18n.translation-key-param',
				params: {param: 'param-value-1'},
				firstChild: createRoute({
					path: 'double/path',
					firstChild: createRoute({
						path: 'some-path',
						firstChild: createRoute({
							path: 'placeholder'
						})
					})
				})
			})
		};

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				declarations: [ObBreadcrumbComponent],
				imports: [ObMockTranslatePipe, RouterTestingModule, ObMockIconModule, MatIconTestingModule, MatTooltipModule],
				providers: [
					{provide: TranslateService, useValue: translateServiceMock},
					{
						provide: ObTBreadcrumbConfig,
						useValue: {parameterSeparator: '/'}
					},
					{provide: ActivatedRoute, useValue: dynamicRouteMock}
				],
				schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
	});
});

function createRoute({
	path,
	label,
	params,
	firstChild
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
			data: {breadcrumb: label}
		},
		snapshot: {
			params
		},
		firstChild
	};
}
