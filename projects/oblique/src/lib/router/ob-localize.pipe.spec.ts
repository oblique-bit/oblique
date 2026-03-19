import {TestBed} from '@angular/core/testing';
import {RouterOutlet, Routes, provideRouter} from '@angular/router';
import {Component, inject} from '@angular/core';
import {RouterTestingHarness} from '@angular/router/testing';
import {OB_HAS_LANGUAGE_IN_URL, provideObliqueTestingConfiguration} from '../utilities';
import {ObLocalizePipe} from './ob-localize.pipe';
import {TranslateLoader, TranslateService, provideTranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';

@Component({
	template: ``,
	providers: [ObLocalizePipe],
})
class DummyComponent {
	readonly pipe = inject(ObLocalizePipe);
	transform(route: string | string[] | null | undefined): string | null | undefined {
		return this.pipe.transform(route);
	}
}

@Component({
	imports: [RouterOutlet],
	template: `<router-outlet />`,
})
class HostComponent {}

describe(ObLocalizePipe.name, () => {
	let harness: RouterTestingHarness;
	const routes: Routes = [
		{path: 'standalone', component: DummyComponent},
		{
			path: 'section',
			children: [{path: 'page', component: DummyComponent}],
		},
		{
			path: 'parent',
			component: DummyComponent,
			children: [{path: 'child', component: DummyComponent}],
		},
	];

	describe('Without language in the URL', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [HostComponent, DummyComponent],
				providers: [provideRouter(routes), provideObliqueTestingConfiguration()],
			}).compileComponents();
			TestBed.createComponent(HostComponent);
			harness = await RouterTestingHarness.create();
		});

		describe.each(['/standalone', '/parent', '/section/page'])('from "%s"', start => {
			it.each([
				{route: null, localizedRoute: null},
				{route: undefined, localizedRoute: undefined},
				{route: '', localizedRoute: start},
				{route: [] as string[], localizedRoute: start},
				{route: [''], localizedRoute: start},
				{route: '/', localizedRoute: '/'},
				{route: ['/'], localizedRoute: '/'},
				{route: '.', localizedRoute: start},
				{route: ['.'], localizedRoute: start},
				{route: './', localizedRoute: start},
				{route: ['./'], localizedRoute: start},
				{route: './italian', localizedRoute: `${start}/italian`},
				{route: ['./italian'], localizedRoute: `${start}/italian`},
				{route: './italian/', localizedRoute: `${start}/italian`},
				{route: ['./italian/'], localizedRoute: `${start}/italian`},
				{route: 'italian', localizedRoute: `${start}/italian`},
				{route: ['italian'], localizedRoute: `${start}/italian`},
				{route: 'italian/', localizedRoute: `${start}/italian`},
				{route: ['italian/'], localizedRoute: `${start}/italian`},
				{route: '/absolute', localizedRoute: '/absolute'},
				{route: ['/absolute'], localizedRoute: '/absolute'},
				{route: '/absolute/', localizedRoute: '/absolute'},
				{route: ['/absolute/'], localizedRoute: '/absolute'},
			])('should transform "$route" into "$localizedRoute"', async ({route, localizedRoute}) => {
				const component = await harness.navigateByUrl(start, DummyComponent);
				expect(component.transform(route)).toBe(localizedRoute);
			});
		});

		describe('go back 1 level', () => {
			it.each([
				{route: '..', localizedRoute: '/', start: '/standalone'},
				{route: '..', localizedRoute: '/', start: '/standalone'},
				{route: '..', localizedRoute: '/', start: '/parent'},
				{route: '..', localizedRoute: '/', start: '/parent'},
				{route: '..', localizedRoute: '/section', start: '/section/page'},
				{route: '../italian', localizedRoute: '/italian', start: '/standalone'},
				{route: '../italian', localizedRoute: '/italian', start: '/parent'},
				{route: '../italian', localizedRoute: '/section/italian', start: '/section/page'},
				{route: '../italian/', localizedRoute: '/italian', start: '/standalone'},
				{route: '../italian/', localizedRoute: '/italian', start: '/parent'},
				{route: '../italian/', localizedRoute: '/section/italian', start: '/section/page'},
			])(
				'should transform "$route" into "$localizedRoute" when starting from "$start"',
				async ({route, localizedRoute, start}) => {
					const component = await harness.navigateByUrl(start, DummyComponent);
					expect(component.transform(route)).toBe(localizedRoute);
					expect(component.transform([route])).toBe(localizedRoute);
				}
			);
		});

		describe('go back 2 levels', () => {
			it.each([
				{route: '../..', localizedRoute: '/'},
				{route: ['../..'], localizedRoute: '/'},
				{route: '../../', localizedRoute: '/'},
				{route: ['../../'], localizedRoute: '/'},
				{route: '../../parent', localizedRoute: '/parent'},
				{route: ['../../parent'], localizedRoute: '/parent'},
				{route: '../../parent/', localizedRoute: '/parent'},
				{route: ['../../parent/'], localizedRoute: '/parent'},
				{route: '../../parent/child', localizedRoute: '/parent/child'},
				{route: ['../../parent', 'child'], localizedRoute: '/parent/child'},
				{route: '../../parent/child/', localizedRoute: '/parent/child'},
				{route: ['../../parent', 'child/'], localizedRoute: '/parent/child%2F'}, // match actual behavior of routerLink
			])(
				'should transform "$route" into "$localizedRoute" when starting from "$start"',
				async ({route, localizedRoute}) => {
					const component = await harness.navigateByUrl('/section/page', DummyComponent);
					expect(component.transform(route)).toBe(localizedRoute);
				}
			);
		});
	});

	describe('With language in the URL', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [HostComponent, DummyComponent],
				providers: [
					provideRouter([{path: 'en', children: routes}]),
					// can't use provideObliqueTestingConfiguration as it breaks harness navigation
					{provide: OB_HAS_LANGUAGE_IN_URL, useValue: true},
					provideTranslateService({
						loader: {
							provide: TranslateLoader,
							useValue: {getTranslation: () => of({})},
						},
					}),
				],
			}).compileComponents();
			TestBed.createComponent(HostComponent);
			harness = await RouterTestingHarness.create();
			const translate = TestBed.inject(TranslateService);
			translate.addLangs(['en', 'it']);
			translate.use('en');
		});

		describe.each(['/en/standalone', '/en/parent', '/en/section/page'])('from "%s"', start => {
			it.each([
				{route: null, localizedRoute: null},
				{route: undefined, localizedRoute: undefined},
				{route: [] as string[], localizedRoute: start},
				{route: '', localizedRoute: start},
				{route: '/', localizedRoute: '/en'},
				{route: '.', localizedRoute: start},
				{route: './', localizedRoute: start},
				{route: './italian', localizedRoute: `${start}/italian`},
				{route: './italian/', localizedRoute: `${start}/italian`},
				{route: 'italian', localizedRoute: `${start}/italian`},
				{route: 'italian/', localizedRoute: `${start}/italian`},
				{route: '/absolute', localizedRoute: '/en/absolute'},
				{route: '/absolute/', localizedRoute: '/en/absolute'},
			])('should transform "$route" into "$localizedRoute"', async ({route, localizedRoute}) => {
				const component = await harness.navigateByUrl(start, DummyComponent);
				expect(component.transform(route)).toBe(localizedRoute);
				if (typeof route === 'string') {
					expect(component.transform([route])).toBe(localizedRoute);
				}
			});
		});

		describe('go back 1 level', () => {
			it.each([
				{route: '..', localizedRoute: '/en', start: '/en/standalone'},
				{route: '..', localizedRoute: '/en', start: '/en/parent'},
				{route: '..', localizedRoute: '/en/section', start: '/en/section/page'},
				{route: '../italian', localizedRoute: '/en/italian', start: '/en/standalone'},
				{route: '../italian', localizedRoute: '/en/italian', start: '/en/parent'},
				{route: '../italian', localizedRoute: '/en/section/italian', start: '/en/section/page'},
				{route: '../italian/', localizedRoute: '/en/italian', start: '/en/standalone'},
				{route: '../italian/', localizedRoute: '/en/italian', start: '/en/parent'},
				{route: '../italian/', localizedRoute: '/en/section/italian', start: '/en/section/page'},
			])(
				'should transform "$route" into "$localizedRoute" when starting from "$start"',
				async ({route, localizedRoute, start}) => {
					const component = await harness.navigateByUrl(start, DummyComponent);
					expect(component.transform(route)).toBe(localizedRoute);
					expect(component.transform([route])).toBe(localizedRoute);
				}
			);
		});

		describe('go back 2 levels', () => {
			it.each([
				{route: '../..', localizedRoute: '/en'},
				{route: ['../..'], localizedRoute: '/en'},
				{route: '../../', localizedRoute: '/en'},
				{route: ['../../'], localizedRoute: '/en'},
				{route: '../../parent', localizedRoute: '/en/parent'},
				{route: ['../../parent'], localizedRoute: '/en/parent'},
				{route: '../../parent/', localizedRoute: '/en/parent'},
				{route: ['../../parent/'], localizedRoute: '/en/parent'},
				{route: '../../parent/child', localizedRoute: '/en/parent/child'},
				{route: ['../../parent', 'child'], localizedRoute: '/en/parent/child'},
				{route: '../../parent/child/', localizedRoute: '/en/parent/child'},
				{route: ['../../parent', 'child/'], localizedRoute: '/en/parent/child%2F'}, // match actual behavior of routerLink
			])(
				'should transform "$route" into "$localizedRoute" when starting from "$start"',
				async ({route, localizedRoute}) => {
					const component = await harness.navigateByUrl('/en/section/page', DummyComponent);
					expect(component.transform(route)).toBe(localizedRoute);
				}
			);
		});

		describe('language change', () => {
			it('should update the language', async () => {
				const component = await harness.navigateByUrl('/en/section/page', DummyComponent);
				expect(component.transform('route')).toBe('/en/section/page/route');
				TestBed.inject(TranslateService).use('it');
				expect(component.transform('route')).toBe('/it/section/page/route');
			});
		});
	});

	describe('With language in the URL and no language route', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [HostComponent, DummyComponent],
				providers: [
					provideRouter([{path: '', component: DummyComponent, children: routes}]),
					// can't use provideObliqueTestingConfiguration as it breaks harness navigation
					{provide: OB_HAS_LANGUAGE_IN_URL, useValue: true},
					provideTranslateService({
						loader: {
							provide: TranslateLoader,
							useValue: {getTranslation: () => of({})},
						},
					}),
				],
			}).compileComponents();
			TestBed.createComponent(HostComponent);
			harness = await RouterTestingHarness.create();
			const translate = TestBed.inject(TranslateService);
			translate.addLangs(['en', 'it']);
			translate.use('en');
		});

		describe('from "/"', () => {
			it.each([
				{route: null, localizedRoute: null},
				{route: undefined, localizedRoute: undefined},
				{route: [] as string[], localizedRoute: '/en'},
				{route: '', localizedRoute: '/en'},
				{route: '/', localizedRoute: '/en'},
				{route: '.', localizedRoute: '/en'},
				{route: './', localizedRoute: '/en'},
				{route: './italian', localizedRoute: `/en/italian`},
				{route: './italian/', localizedRoute: `/en/italian`},
				{route: 'italian', localizedRoute: `/en/italian`},
				{route: 'italian/', localizedRoute: `/en/italian`},
				{route: '/absolute', localizedRoute: '/en/absolute'},
				{route: '/absolute/', localizedRoute: '/en/absolute'},
			])('should transform "$route" into "$localizedRoute"', async ({route, localizedRoute}) => {
				const component = await harness.navigateByUrl('/', DummyComponent);
				expect(component.transform(route)).toBe(localizedRoute);
				if (typeof route === 'string') {
					expect(component.transform([route])).toBe(localizedRoute);
				}
			});
		});
	});
});
