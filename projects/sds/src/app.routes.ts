import type {Routes, UrlMatchResult, UrlSegment} from '@angular/router';
import {urlConst} from './app/shared/url/url.const';
import {InvalidComponent} from './app/invalid/invalid.component';

export const appRoutes: Routes = [
	{path: '', redirectTo: 'introductions/welcome', pathMatch: 'full'},
	{path: 'invalid', component: InvalidComponent},
	{
		loadChildren: async () => import('./app/component-page/component-pages.routes'),
		matcher: (url: UrlSegment[]): UrlMatchResult =>
			['newsletter'].includes(url[1].toString())
				? {consumed: [url[0]], posParams: {[urlConst.urlParams.selectedSlug]: url[1]}}
				: null,
	},
	{
		path: `introductions/:${urlConst.urlParams.selectedSlug}`,
		loadChildren: async () => import('./app/text-page/text-pages.routes'),
	},
	{
		path: `guidelines/:${urlConst.urlParams.selectedSlug}`,
		loadChildren: async () => import('./app/text-page/text-pages.routes'),
	},
	{
		path: `foundations/:${urlConst.urlParams.selectedSlug}`,
		loadChildren: async () => import('./app/tabbed-page/tabbed-pages.routes'),
	},
	{
		path: `helpers/:${urlConst.urlParams.selectedSlug}`,
		loadChildren: async () => import('./app/tabbed-page/tabbed-pages.routes'),
	},
	{
		path: `components/:${urlConst.urlParams.selectedSlug}`,
		loadChildren: async () => import('./app/tabbed-page/tabbed-pages.routes'),
	},
	{
		path: '**',
		redirectTo: 'invalid',
	},
];
