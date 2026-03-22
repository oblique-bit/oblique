import {TestBed} from '@angular/core/testing';
import {Router, provideRouter} from '@angular/router';
import {Component} from '@angular/core';
import {RouterTestingHarness} from '@angular/router/testing';
import {WINDOW} from '@oblique/oblique';
import {type Observable, Subject, of} from 'rxjs';
import type {CMSPages} from '../../cms/models/cms-page.model';
import {CmsRouteRedirector} from './cms-route-redirector';

@Component({
	template: '',
})
class DummyComponent {}

describe(CmsRouteRedirector.name, () => {
	let service: CmsRouteRedirector;
	let router: Router;
	let harness: RouterTestingHarness;
	const mockWindow = {open: jest.fn(), location: {origin: 'http://localhost'}};
	const version$ = new Subject<number>();
	const pages$: Observable<CMSPages> = of({
		tabbedPages: {
			data: [
				{id: 0, name: '', category: 0, slug: 'regular', min_version: 2, max_version: 2},
				{id: 0, name: '', category: 0, slug: 'regular-1', min_version: 3, max_version: 4},
				{id: 0, name: '', category: 0, slug: 'regular-2', min_version: 5, max_version: 6},
				{id: 0, name: '', category: 0, slug: 'no-upper-bound', min_version: 1, max_version: undefined},
				{id: 0, name: '', category: 0, slug: 'no-lower-bound', min_version: undefined, max_version: 5},
				{id: 0, name: '', category: 0, slug: 'no-bound', min_version: undefined, max_version: undefined},
				{id: 0, name: '', category: 0, slug: 'edge-case', min_version: 1, max_version: 1},
				{id: 0, name: '', category: 0, slug: 'edge-case-', min_version: 2, max_version: 2},
				{id: 0, name: '', category: 0, slug: 'edge-case-1-2', min_version: 3, max_version: 3},
				{id: 0, name: '', category: 0, slug: 'edge-case-1-foo', min_version: 4, max_version: 4},
				{id: 0, name: '', category: 0, slug: 'collision', min_version: 1, max_version: 2},
				{id: 0, name: '', category: 0, slug: 'collision-1', min_version: 2, max_version: 2},
				{id: 0, name: '', category: 0, slug: 'inverted', min_version: 2, max_version: 1},
			],
		},
		textPages: {data: []},
	});
	const routes = {
		'/': [
			{version: 1, result: '/'},
			{version: 2, result: '/'},
			{version: 3, result: '/'},
			{version: 99, result: '/'},
		],
		'/category/regular/tab': [
			{version: 1, result: '/category/invalid/tab'},
			{version: 2, result: '/category/regular/tab'},
			{version: 3, result: '/category/regular-1/tab'},
			{version: 99, result: '/category/invalid/tab'},
		],
		'/category/regular/tab#hash': [
			{version: 1, result: '/category/invalid/tab#hash'},
			{version: 2, result: '/category/regular/tab#hash'},
			{version: 3, result: '/category/regular-1/tab#hash'},
			{version: 99, result: '/category/invalid/tab#hash'},
		],
		'/category/regular/tab?param=1': [
			{version: 1, result: '/category/invalid/tab?param=1'},
			{version: 2, result: '/category/regular/tab?param=1'},
			{version: 3, result: '/category/regular-1/tab?param=1'},
			{version: 99, result: '/category/invalid/tab?param=1'},
		],
		'/category/regular/tab?param=1#hash': [
			{version: 1, result: '/category/invalid/tab?param=1#hash'},
			{version: 2, result: '/category/regular/tab?param=1#hash'},
			{version: 3, result: '/category/regular-1/tab?param=1#hash'},
			{version: 99, result: '/category/invalid/tab?param=1#hash'},
		],
		'/category/regular-1/tab': [
			{version: 1, result: '/category/invalid/tab'},
			{version: 2, result: '/category/regular/tab'},
			{version: 3, result: '/category/regular-1/tab'},
			{version: 99, result: '/category/invalid/tab'},
		],
		'/category/no-upper-bound/tab': [
			{version: 0, result: '/category/invalid/tab'},
			{version: 1, result: '/category/no-upper-bound/tab'},
			{version: 99, result: '/category/no-upper-bound/tab'},
		],
		'/category/no-lower-bound/tab': [
			{version: -1, result: '/category/no-lower-bound/tab'},
			{version: 0, result: '/category/no-lower-bound/tab'},
			{version: 1, result: '/category/no-lower-bound/tab'},
			{version: 99, result: '/category/invalid/tab'},
		],
		'/category/no-bound/tab': [
			{version: -1, result: '/category/no-bound/tab'},
			{version: 0, result: '/category/no-bound/tab'},
			{version: 1, result: '/category/no-bound/tab'},
			{version: 99, result: '/category/no-bound/tab'},
		],
		'/category/edge-case/tab': [
			{version: 1, result: '/category/edge-case/tab'},
			{version: 2, result: '/category/invalid/tab'},
			{version: 3, result: '/category/invalid/tab'},
			{version: 4, result: '/category/invalid/tab'},
		],
		'/category/edge-case-/tab': [
			{version: 1, result: '/category/invalid/tab'},
			{version: 2, result: '/category/edge-case-/tab'},
			{version: 3, result: '/category/invalid/tab'},
			{version: 4, result: '/category/invalid/tab'},
		],
		'/category/edge-case-1-2/tab': [
			{version: 1, result: '/category/invalid/tab'},
			{version: 2, result: '/category/invalid/tab'},
			{version: 3, result: '/category/edge-case-1-2/tab'},
			{version: 4, result: '/category/invalid/tab'},
		],
		'/category/edge-case-1-foo/tab': [
			{version: 1, result: '/category/invalid/tab'},
			{version: 2, result: '/category/invalid/tab'},
			{version: 3, result: '/category/invalid/tab'},
			{version: 4, result: '/category/edge-case-1-foo/tab'},
		],
		'/category/inverted/tab': [
			{version: 1, result: '/category/invalid/tab'},
			{version: 2, result: '/category/invalid/tab'},
			{version: 3, result: '/category/invalid/tab'},
			{version: 4, result: '/category/invalid/tab'},
		],
	};

	beforeEach(async () => {
		TestBed.configureTestingModule({
			providers: [
				CmsRouteRedirector,
				provideRouter([{path: ':category/:slug/:tab', component: DummyComponent}]),
				{provide: WINDOW, useValue: mockWindow},
			],
		});

		service = TestBed.inject(CmsRouteRedirector);
		router = TestBed.inject(Router);
		jest.spyOn(router, 'navigate');
		harness = await RouterTestingHarness.create();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe(CmsRouteRedirector.prototype.redirectOnVersionChange.name, () => {
		beforeEach(() => {
			service.redirectOnVersionChange(pages$, version$);
		});
		const routeKeys = Object.keys(routes) as (keyof typeof routes)[];

		describe.each(routeKeys)('with %s route', route => {
			test.each(routes[route])('with version $version', async ({version, result}) => {
				await harness.navigateByUrl(route);
				version$.next(version);
				await harness.fixture.whenStable();

				expect(router.url).toBe(result);
				expect(mockWindow.open).not.toHaveBeenCalled();
			});
		});

		describe.each(['collision', 'collision-1'])('with %s route', route => {
			test.each([
				{version: 1, result: '/category/collision/tab', error: false},
				{version: 2, result: '/category/collision/tab', error: true},
			])('with version $version', async ({version, result, error}) => {
				jest.spyOn(console, 'error');
				await harness.navigateByUrl(`category/${route}/tab`);
				version$.next(version);
				await harness.fixture.whenStable();

				expect(router.url).toBe(result);
				expect(mockWindow.open).not.toHaveBeenCalled();
				if (error) {
					expect(console.error).toHaveBeenCalledWith('"collision" and "collision-1" slugs are valid for version 2.');
				} else {
					expect(console.error).not.toHaveBeenCalledWith();
				}
			});
		});
	});
});
