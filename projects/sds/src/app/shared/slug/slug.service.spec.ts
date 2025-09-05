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
					{path: 'inexistent/route', component: DummyComponent},
					{path: 'introductions/welcome-10', component: DummyComponent},
					{path: 'introductions/configuration', component: DummyComponent},
					{path: 'introductions/configuration-12', component: DummyComponent},
					{path: 'introductions/configuration-14', component: DummyComponent},
					{path: 'introductions/getting-started-as-a-designer', component: DummyComponent},
					{path: 'components/button/examples', component: DummyComponent},
					{path: 'components/button-14/examples', component: DummyComponent},
					{path: 'components/column-layout/examples', component: DummyComponent},
					{path: 'components/column-layout-14/examples', component: DummyComponent},
					{path: 'components/date/examples', component: DummyComponent},
					{path: 'components/date-14/examples', component: DummyComponent},
					{path: 'components/master-layout/examples', component: DummyComponent},
					{path: 'components/master-layout-12/examples', component: DummyComponent},
					{path: 'components/master-layout-13/ui-ux', component: DummyComponent},
					{path: 'components/popover/examples', component: DummyComponent},
					{path: 'components/popover-12/examples', component: DummyComponent},
					{path: 'components/language/examples', component: DummyComponent},
					{path: 'components/datepicker/api', component: DummyComponent},
					{path: 'components/datepicker/examples', component: DummyComponent},
					{path: 'foundations/typography/examples', component: DummyComponent},
					{path: 'foundations/typography-14/examples', component: DummyComponent},
					{path: 'foundations/shadow/examples', component: DummyComponent},
					{path: 'guidelines/getting-started-figma', component: DummyComponent},
					{path: 'guidelines/service-navigation-web-component/examples', component: DummyComponent},
					{path: 'guidelines/service-navigation-web-component-14/examples', component: DummyComponent},
					{path: 'helpers/provide-oblique-configuration/examples', component: DummyComponent},
					{path: 'helpers/provide-oblique-configuration-14/examples', component: DummyComponent}
				])
			]
		});
		service = TestBed.inject(SlugService);
		router = TestBed.inject(Router);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	const versionRoutes = {
		10: [
			{route: 'inexistent/route', newSlug: undefined},
			{route: 'introductions/welcome-10', newSlug: undefined},
			{route: 'introductions/configuration', newSlug: undefined},
			{route: 'introductions/configuration-12', newSlug: undefined},
			{route: 'introductions/configuration-14', newSlug: undefined},
			{route: 'introductions/getting-started-as-a-designer', newSlug: undefined},
			{route: 'components/button/examples', newSlug: undefined},
			{route: 'components/button-14/examples', newSlug: undefined},
			{route: 'components/column-layout/examples', newSlug: undefined},
			{route: 'components/column-layout-14/examples', newSlug: undefined},
			{route: 'components/date/examples', newSlug: undefined},
			{route: 'components/date-14/examples', newSlug: undefined},
			{route: 'components/master-layout/examples', newSlug: undefined},
			{route: 'components/master-layout-12/examples', newSlug: undefined},
			{route: 'components/master-layout-13/ui-ux', newSlug: undefined},
			{route: 'components/popover/examples', newSlug: undefined},
			{route: 'components/popover-12/examples', newSlug: undefined},
			{route: 'components/language/examples', newSlug: undefined},
			{route: 'components/datepicker/api', newSlug: undefined},
			{route: 'components/datepicker/examples', newSlug: undefined},
			{route: 'foundations/typography/examples', newSlug: undefined},
			{route: 'foundations/typography-14/examples', newSlug: undefined},
			{route: 'foundations/shadow/examples', newSlug: undefined},
			{route: 'guidelines/getting-started-figma', newSlug: undefined},
			{route: 'guidelines/service-navigation-web-component/examples', newSlug: undefined},
			{route: 'guidelines/service-navigation-web-component-14/examples', newSlug: undefined},
			{route: 'helpers/provide-oblique-configuration/examples', newSlug: undefined},
			{route: 'helpers/provide-oblique-configuration-14/examples', newSlug: undefined}
		],
		11: [
			{route: 'inexistent/route', newSlug: undefined},
			{route: 'introductions/welcome-10', newSlug: undefined},
			{route: 'introductions/configuration', newSlug: undefined},
			{route: 'introductions/configuration-12', newSlug: 'configuration'},
			{route: 'introductions/configuration-14', newSlug: 'configuration'},
			{route: 'introductions/getting-started-as-a-designer', newSlug: 'invalid'},
			{route: 'components/button/examples', newSlug: undefined},
			{route: 'components/button-14/examples', newSlug: 'button'},
			{route: 'components/column-layout/examples', newSlug: undefined},
			{route: 'components/column-layout-14/examples', newSlug: 'column-layout'},
			{route: 'components/date/examples', newSlug: undefined},
			{route: 'components/date-14/examples', newSlug: 'date'},
			{route: 'components/master-layout/examples', newSlug: undefined},
			{route: 'components/master-layout-12/examples', newSlug: 'master-layout'},
			{route: 'components/master-layout-13/ui-ux', newSlug: 'master-layout'},
			{route: 'components/popover/examples', newSlug: undefined},
			{route: 'components/popover-12/examples', newSlug: 'popover'},
			{route: 'components/language/examples', newSlug: undefined},
			{route: 'components/datepicker/api', newSlug: undefined},
			{route: 'components/datepicker/examples', newSlug: undefined},
			{route: 'foundations/shadow/examples', newSlug: 'invalid'},
			{route: 'foundations/typography/examples', newSlug: undefined},
			{route: 'foundations/typography-14/examples', newSlug: 'typography'},
			{route: 'guidelines/getting-started-figma', newSlug: 'invalid'},
			{route: 'guidelines/service-navigation-web-component/examples', newSlug: undefined},
			{route: 'guidelines/service-navigation-web-component-14/examples', newSlug: 'service-navigation-web-component'},
			{route: 'helpers/provide-oblique-configuration/examples', newSlug: undefined},
			{route: 'helpers/provide-oblique-configuration-14/examples', newSlug: 'provide-oblique-configuration'}
		],
		12: [
			{route: 'inexistent/route', newSlug: undefined},
			{route: 'introductions/welcome-10', newSlug: undefined},
			{route: 'introductions/configuration', newSlug: 'configuration-12'},
			{route: 'introductions/configuration-12', newSlug: undefined},
			{route: 'introductions/configuration-14', newSlug: 'configuration-12'},
			{route: 'introductions/getting-started-as-a-designer', newSlug: 'invalid'},
			{route: 'components/button/examples', newSlug: undefined},
			{route: 'components/button-14/examples', newSlug: 'button'},
			{route: 'components/column-layout/examples', newSlug: undefined},
			{route: 'components/column-layout-14/examples', newSlug: 'column-layout'},
			{route: 'components/date/examples', newSlug: undefined},
			{route: 'components/date-14/examples', newSlug: 'date'},
			{route: 'components/master-layout/examples', newSlug: 'master-layout-12'},
			{route: 'components/master-layout-12/examples', newSlug: undefined},
			{route: 'components/master-layout-13/ui-ux', newSlug: 'master-layout-12'},
			{route: 'components/popover/examples', newSlug: 'popover-12'},
			{route: 'components/popover-12/examples', newSlug: undefined},
			{route: 'components/language/examples', newSlug: 'invalid'},
			{route: 'components/datepicker/api', newSlug: 'invalid'},
			{route: 'components/datepicker/examples', newSlug: 'invalid'},
			{route: 'foundations/shadow/examples', newSlug: undefined},
			{route: 'foundations/typography/examples', newSlug: undefined},
			{route: 'foundations/typography-14/examples', newSlug: 'typography'},
			{route: 'guidelines/getting-started-figma', newSlug: 'invalid'},
			{route: 'guidelines/service-navigation-web-component/examples', newSlug: undefined},
			{route: 'guidelines/service-navigation-web-component-14/examples', newSlug: 'service-navigation-web-component'},
			{route: 'helpers/provide-oblique-configuration/examples', newSlug: undefined},
			{route: 'helpers/provide-oblique-configuration-14/examples', newSlug: 'provide-oblique-configuration'}
		],
		13: [
			{route: 'inexistent/route', newSlug: undefined},
			{route: 'introductions/welcome-10', newSlug: undefined},
			{route: 'introductions/configuration', newSlug: 'configuration-12'},
			{route: 'introductions/configuration-12', newSlug: undefined},
			{route: 'introductions/configuration-14', newSlug: 'configuration-12'},
			{route: 'introductions/getting-started-as-a-designer', newSlug: undefined},
			{route: 'components/button/examples', newSlug: undefined},
			{route: 'components/button-14/examples', newSlug: 'button'},
			{route: 'components/column-layout/examples', newSlug: undefined},
			{route: 'components/column-layout-14/examples', newSlug: 'column-layout'},
			{route: 'components/date/examples', newSlug: undefined},
			{route: 'components/date-14/examples', newSlug: 'date'},
			{route: 'components/master-layout/examples', newSlug: 'master-layout-13'},
			{route: 'components/master-layout-12/examples', newSlug: 'master-layout-13'},
			{route: 'components/master-layout-13/ui-ux', newSlug: undefined},
			{route: 'components/popover/examples', newSlug: 'popover-12'},
			{route: 'components/popover-12/examples', newSlug: undefined},
			{route: 'components/language/examples', newSlug: 'invalid'},
			{route: 'components/datepicker/api', newSlug: 'invalid'},
			{route: 'components/datepicker/examples', newSlug: 'invalid'},
			{route: 'foundations/shadow/examples', newSlug: undefined},
			{route: 'foundations/typography/examples', newSlug: undefined},
			{route: 'foundations/typography-14/examples', newSlug: 'typography'},
			{route: 'guidelines/getting-started-figma', newSlug: undefined},
			{route: 'guidelines/service-navigation-web-component/examples', newSlug: undefined},
			{route: 'guidelines/service-navigation-web-component-14/examples', newSlug: 'service-navigation-web-component'},
			{route: 'helpers/provide-oblique-configuration/examples', newSlug: undefined},
			{route: 'helpers/provide-oblique-configuration-14/examples', newSlug: 'provide-oblique-configuration'}
		],
		14: [
			{route: 'inexistent/route', newSlug: undefined},
			{route: 'introductions/welcome-10', newSlug: undefined},
			{route: 'introductions/configuration', newSlug: 'configuration-14'},
			{route: 'introductions/configuration-12', newSlug: 'configuration-14'},
			{route: 'introductions/configuration-14', newSlug: undefined},
			{route: 'introductions/getting-started-as-a-designer', newSlug: undefined},
			{route: 'components/button/examples', newSlug: 'button-14'},
			{route: 'components/button-14/examples', newSlug: undefined},
			{route: 'components/column-layout/examples', newSlug: 'column-layout-14'},
			{route: 'components/column-layout-14/examples', newSlug: undefined},
			{route: 'components/date/examples', newSlug: 'date-14'},
			{route: 'components/date-14/examples', newSlug: undefined},
			{route: 'components/master-layout/examples', newSlug: 'master-layout-14'},
			{route: 'components/master-layout-12/examples', newSlug: 'master-layout-14'},
			{route: 'components/master-layout-13/ui-ux', newSlug: 'master-layout-14'},
			{route: 'components/popover/examples', newSlug: 'popover-12'},
			{route: 'components/popover-12/examples', newSlug: undefined},
			{route: 'components/language/examples', newSlug: 'invalid'},
			{route: 'components/datepicker/api', newSlug: 'invalid'},
			{route: 'components/datepicker/examples', newSlug: 'invalid'},
			{route: 'foundations/shadow/examples', newSlug: undefined},
			{route: 'foundations/typography/examples', newSlug: 'typography-14'},
			{route: 'foundations/typography-14/examples', newSlug: undefined},
			{route: 'guidelines/getting-started-figma', newSlug: undefined},
			{route: 'guidelines/service-navigation-web-component/examples', newSlug: 'service-navigation-web-component-14'},
			{route: 'guidelines/service-navigation-web-component-14/examples', newSlug: undefined},
			{route: 'helpers/provide-oblique-configuration/examples', newSlug: 'provide-oblique-configuration-14'},
			{route: 'helpers/provide-oblique-configuration-14/examples', newSlug: undefined}
		]
	};
	describe.each([10, 11, 12, 13, 14])(`${SlugService.prototype.getNewSlug.name} version %s`, version => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		it.each(versionRoutes[version])(
			'should return "$newSlug" with "$route"',
			fakeAsync(({route, newSlug}) => {
				router.navigate([route]);
				tick();
				expect(service.getNewSlug(version)).toBe(newSlug);
			})
		);
	});
});
