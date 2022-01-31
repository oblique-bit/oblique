import {ComponentFixture, TestBed, fakeAsync, tick, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObMasterLayoutNavigationComponent} from '../master-layout-navigation/master-layout-navigation.component';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {ObMockGlobalEventsService} from '../../global-events/_mocks/mock-global-events.service';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {WINDOW} from '../../utilities';

@Component({template: ''})
class DummyFullPathComponent {}

@Component({template: ''})
class DummyPrefixPathComponent {}

@Component({template: ''})
class DummyDefaultPathComponent {}

describe('MasterLayoutNavigationComponent', () => {
	let router: Router;
	let component: ObMasterLayoutNavigationComponent;
	let fixture: ComponentFixture<ObMasterLayoutNavigationComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ObMasterLayoutNavigationComponent, ObMockTranslatePipe, DummyFullPathComponent, DummyPrefixPathComponent, DummyDefaultPathComponent],
				imports: [
					RouterTestingModule.withRoutes([
						{path: 'defaultPathMatch', component: DummyDefaultPathComponent},
						{path: 'prefix/1/users', component: DummyPrefixPathComponent},
						{path: 'prefix/:id/users', component: DummyPrefixPathComponent},
						{path: 'full/2/users', component: DummyFullPathComponent},
						{path: 'full/:id', component: DummyFullPathComponent},
						{path: '**', redirectTo: 'defaultPathMatch'}
					])
				],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{provide: TranslateService, useClass: ObMockTranslateService},
					{provide: ObGlobalEventsService, useClass: ObMockGlobalEventsService},
					{provide: WINDOW, useValue: window}
				]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ObMasterLayoutNavigationComponent);
		component = fixture.componentInstance;
		component.links = [
			{url: 'defaultPathMatch', label: 'default', id: 'default'},
			{
				url: 'prefix/1/users',
				label: 'ItemPrefix',
				id: 'prefix',
				routerLinkActiveOptions: {paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored'}
			},
			{
				url: 'prefix/2/users',
				label: 'ItemPrefix2',
				id: 'prefix',
				routerLinkActiveOptions: {paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored'}
			},
			{
				url: 'full/2/users',
				label: 'ItemFull',
				id: 'full',
				routerLinkActiveOptions: {paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored'}
			}
		];
		router = TestBed.inject(Router);
		router.initialNavigation();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('HTMLSelectElement in template pathMatch with navigation elements', () => {
		describe('with prefix pathMatch strategy', () => {
			let element: HTMLElement;
			beforeEach(() => {
				element = getHTMLSelectElementByQueryCSS('#prefix');
			});
			it('should have a link with prefix id', () => {
				expect(element).toBeTruthy();
			});
			it('should have prefix-path label', () => {
				expect(element.textContent).toContain('ItemPrefix');
			});
			it('should have active class', () => {
				expect(element.getAttribute('ng-reflect-router-link-active')).toBe('active');
			});
		});
		describe('with full pathMatch strategy', () => {
			let element: HTMLElement;
			beforeEach(() => {
				element = getHTMLSelectElementByQueryCSS('#full');
			});
			it('should have an element with full idk', () => {
				expect(element).toBeTruthy();
			});
			it('should have full path-label', () => {
				expect(element.textContent).toContain('ItemFull');
			});
			it('should have active attribute', () => {
				expect(element.getAttribute('ng-reflect-router-link-active')).toBe('active');
			});
		});
		describe('with default pathMatch strategy', () => {
			let element: HTMLElement;
			beforeEach(() => {
				element = getHTMLSelectElementByQueryCSS('#default');
			});
			it('should have an element with default id', () => {
				expect(element).toBeTruthy();
			});
			it('should have full path-label', () => {
				expect(element.textContent).toContain('default');
			});
			it('should have active attribute', () => {
				expect(element.getAttribute('ng-reflect-router-link-active')).toBe('active');
			});
		});
	});
	describe('Property isExternal', () => {
		it('should set false in property isExternal of last  Link', () => {
			fixture.detectChanges();
			expect(component.links[component.links.length - 1].isExternal).toBe(false);
		});

		it('should set false in property isExternal of second Link', () => {
			fixture.detectChanges();
			expect(component.links[component.links.length - 2].isExternal).toBe(false);
		});

		it('should set false in property isExternal of first Link', () => {
			expect(component.links[component.links.length - 3].isExternal).toBe(false);
		});
	});

	describe('check after routing', () => {
		describe('to DummyDefaultPathComponent', () => {
			it('should have only one class active after routing', fakeAsync(() => {
				router.navigate(['defaultPathMatch']);
				tick();
				const defaultLink = getElementByQueryAllCSS('.active');
				expect(defaultLink.length).toBe(1);
			}));
			it('should have textContent "default" after routing', fakeAsync(() => {
				router.navigate(['defaultPathMatch']);
				tick();
				const defaultLink = getElementByQueryAllCSS('.active');
				expect(defaultLink[0].nativeElement.textContent).toContain('default');
			}));
		});
		describe('to DummyPrefixPathComponent', () => {
			const prefixPathUser2 = 'prefix/2/users';
			const prefixPathUser3 = 'prefix/3/users';
			it('should have only one class active after routing', fakeAsync(() => {
				router.navigate([prefixPathUser2]);
				tick();
				const prefixLink = getElementByQueryAllCSS('.active');
				expect(prefixLink.length).toBe(1);
			}));
			it('should have only one class active after routing by prefix', fakeAsync(() => {
				router.navigate([prefixPathUser2]);
				tick();
				const prefixLink = getElementByQueryAllCSS('.active');
				expect(prefixLink.length).toBe(1);
			}));
			it('shouldnt have class active after routing by unknown', fakeAsync(() => {
				router.navigate([prefixPathUser3]);
				tick();
				const prefixLink = getElementByQueryAllCSS('.active');
				expect(prefixLink.length).toBe(0);
			}));
		});
		describe('to DummyFullPathComponent', () => {
			const fullPathUser2 = 'full/2/users';
			it('shouldnt have class active after routing', fakeAsync(() => {
				router.navigate(['full/1']);
				tick();
				const defaultLink = getElementByQueryAllCSS('.active');
				expect(defaultLink.length).toBe(0);
			}));
			it('should have class active after routing', fakeAsync(() => {
				router.navigate(['full/1/users']);
				tick();
				const defaultLink = getElementByQueryAllCSS('.active');
				expect(defaultLink.length).toBe(1);
			}));
			it('should have textContent "full" after routing', fakeAsync(() => {
				router.navigate([fullPathUser2]);
				tick();
				const prefixLink = getElementByQueryAllCSS('.active');
				expect(prefixLink[0].nativeElement.textContent).toContain('ItemFull');
			}));
		});
	});

	function getElementByQueryAllCSS(selector: string): DebugElement[] {
		return fixture.debugElement.queryAll(By.css(selector));
	}

	function getHTMLSelectElementByQueryCSS(selector: string): HTMLElement {
		return fixture.debugElement.query(By.css(selector)).nativeElement;
	}
});
