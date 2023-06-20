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
import {ObMockMasterLayoutNavigationItemDirective} from '../_mocks/mock-master-layout-navigation-item.directive';

@Component({template: ''})
class DummyFullPathComponent {}

@Component({template: ''})
class DummyPrefixPathComponent {}

@Component({template: ''})
class DummyDefaultPathComponent {}

describe(ObMasterLayoutNavigationComponent.name, () => {
	let router: Router;
	let component: ObMasterLayoutNavigationComponent;
	let fixture: ComponentFixture<ObMasterLayoutNavigationComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [
				ObMasterLayoutNavigationComponent,
				ObMockMasterLayoutNavigationItemDirective,
				ObMockTranslatePipe,
				DummyFullPathComponent,
				DummyPrefixPathComponent,
				DummyDefaultPathComponent
			],
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
	}));

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

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test.each<{idx: number}>([{idx: 0}, {idx: 1}, {idx: 2}])('that property isExternal of Link is set to false at index: $idx', ({idx}) => {
		fixture.detectChanges();
		expect(component.initializedLinks[idx].isExternal).toBe(false);
	});

	test.each<{route: string; label: string}>([
		{route: 'defaultPathMatch', label: 'default'},
		{route: 'full/2/users', label: 'ItemFull'}
	])(
		'that after routing to: $route, the textContent of the active element contains: $label',
		fakeAsync(({route, label}) => {
			router.navigate([route]);
			tick();
			expect(getElementByQueryAllCSS('.active')[0].nativeElement.textContent).toContain(label);
		})
	);

	test.each<{route: string; length: number}>([
		{route: 'defaultPathMatch', length: 1},
		{route: 'prefix/2/users', length: 1},
		{route: 'prefix/3/users', length: 0},
		{route: 'full/1/users', length: 1},
		{route: 'full/1', length: 0}
	])(
		'that $length element(s) have class active after routing to: $route',
		fakeAsync(({route, length}) => {
			router.navigate([route]);
			tick();
			const prefixLink = getElementByQueryAllCSS('.active');
			expect(prefixLink.length).toBe(length);
		})
	);

	describe('HTMLSelectElement in template pathMatch with navigation elements', () => {
		describe.each<{id: string; label: string}>([
			{id: 'prefix', label: 'ItemPrefix'},
			{id: 'full', label: 'ItemFull'},
			{id: 'default', label: 'default'}
		])('with $id pathMatch strategy', ({id, label}) => {
			let element: HTMLElement;
			beforeAll(() => {
				element = getHTMLSelectElementByQueryCSS(`#${id}`);
			});
			test('that there is a link with id: $id', () => {
				expect(element).toBeTruthy();
			});
			test('that link text contains $label', () => {
				expect(element.textContent).toContain(label);
			});
			test('that link has active attribute', () => {
				expect(element.getAttribute('ng-reflect-router-link-active')).toBe('active');
			});
		});
	});

	function getElementByQueryAllCSS(selector: string): DebugElement[] {
		return fixture.debugElement.queryAll(By.css(selector));
	}

	function getHTMLSelectElementByQueryCSS(selector: string): HTMLElement {
		return fixture.debugElement.query(By.css(selector)).nativeElement;
	}
});
