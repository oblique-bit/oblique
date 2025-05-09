import {TestBed, fakeAsync, tick} from '@angular/core/testing';

import {SlugService} from './slug.service';
import {Router, RouterModule} from '@angular/router';
import {Component} from '@angular/core';

@Component({template: ''})
class DummyComponent {}

describe(SlugService.name, () => {
	let service: SlugService;
	let router: Router;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterModule.forRoot([
					{path: 'introductions/welcome-10', component: DummyComponent},
					{path: 'introductions/configuration-12', component: DummyComponent},
					{path: 'components/master-layout-12/examples', component: DummyComponent},
					{path: 'components/master-layout-13/ui-ux', component: DummyComponent},
					{path: 'components/popover-12/examples', component: DummyComponent},
					{path: 'foundations/shadow/examples', component: DummyComponent},
					{path: 'guidelines/getting-started-figma', component: DummyComponent},
					{path: 'introductions/getting-started-as-a-designer', component: DummyComponent},
					{path: 'asdfghjkl/qwertzuiop', component: DummyComponent},
					{path: 'introductions/configuration', component: DummyComponent},
					{path: 'components/master-layout/examples', component: DummyComponent},
					{path: 'components/popover/examples', component: DummyComponent},
					{path: 'components/language/examples', component: DummyComponent},
					{path: 'components/datepicker/api', component: DummyComponent},
					{path: 'components/datepicker/examples', component: DummyComponent}
				])
			]
		});
		service = TestBed.inject(SlugService);
		router = TestBed.inject(Router);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe(SlugService.prototype.getNewSlug.name, () => {
		const versionRoutes: {version: number; route: string; newSlug: string}[] = [
			{version: 11, route: 'introductions/configuration-12', newSlug: 'configuration'},
			{version: 11, route: 'components/master-layout-12/examples', newSlug: 'master-layout'},
			{version: 11, route: 'components/master-layout-13/ui-ux', newSlug: 'master-layout'},
			{version: 11, route: 'components/popover-12/examples', newSlug: 'popover'},
			{version: 11, route: 'foundations/shadow/examples', newSlug: 'invalid'},
			{version: 11, route: 'guidelines/getting-started-figma', newSlug: 'invalid'},
			{version: 11, route: 'introductions/getting-started-as-a-designer', newSlug: 'invalid'},
			{version: 11, route: 'asdfghjkl/qwertzuiop', newSlug: undefined},
			{version: 12, route: 'introductions/configuration', newSlug: 'configuration-12'},
			{version: 12, route: 'components/master-layout/examples', newSlug: 'master-layout-12'},
			{version: 12, route: 'components/master-layout-13/ui-ux', newSlug: 'master-layout-12'},
			{version: 12, route: 'components/popover/examples', newSlug: 'popover-12'},
			{version: 12, route: 'components/language/examples', newSlug: 'invalid'},
			{version: 12, route: 'components/datepicker/examples', newSlug: 'invalid'},
			{version: 12, route: 'guidelines/getting-started-figma', newSlug: 'invalid'},
			{version: 12, route: 'introductions/getting-started-as-a-designer', newSlug: 'invalid'},
			{version: 13, route: 'introductions/configuration', newSlug: 'configuration-12'},
			{version: 13, route: 'components/master-layout/examples', newSlug: 'master-layout-13'},
			{version: 13, route: 'components/master-layout-12/examples', newSlug: 'master-layout-13'},
			{version: 13, route: 'components/popover/examples', newSlug: 'popover-12'},
			{version: 13, route: 'components/language/examples', newSlug: 'invalid'},
			{version: 13, route: 'components/datepicker/api', newSlug: 'invalid'}
		];

		it.each(versionRoutes)(
			'should return slug $newSlug when the version is $version and the route is $route',
			fakeAsync(({version, route, newSlug}) => {
				router.navigate([route]);
				tick();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				expect(service.getNewSlug(version)).toBe(newSlug);
			})
		);
	});
});
