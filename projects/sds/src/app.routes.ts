import {Routes, UrlMatchResult, UrlSegment} from '@angular/router';
import {URL_CONST} from './app/shared/url/url.const';
import {InvalidComponent} from './app/invalid/invalid.component';

export const APP_ROUTES: Routes = [
	{path: '', redirectTo: 'introductions/welcome', pathMatch: 'full'},
	{path: 'invalid', component: InvalidComponent},
	{
		loadChildren: () => import('./app/component-page/component-pages.routes'),
		matcher: (url: UrlSegment[]): UrlMatchResult =>
			['newsletter'].includes(url[1].toString()) ? {consumed: [url[0]], posParams: {[URL_CONST.urlParams.selectedSlug]: url[1]}} : null
	},
	{
		path: `introductions/:${URL_CONST.urlParams.selectedSlug}`,
		loadChildren: () => import('./app/text-page/text-pages.routes')
	},
	{
		path: `guidelines/:${URL_CONST.urlParams.selectedSlug}`,
		loadChildren: () => import('./app/text-page/text-pages.routes')
	},
	{
		path: `foundations/:${URL_CONST.urlParams.selectedSlug}`,
		loadChildren: () => import('./app/tabbed-page/tabbed-pages.routes')
	},
	{
		path: `helpers/:${URL_CONST.urlParams.selectedSlug}`,
		loadChildren: () => import('./app/tabbed-page/tabbed-pages.routes')
	},
	{
		path: `components/:${URL_CONST.urlParams.selectedSlug}`,
		loadChildren: () => import('./app/tabbed-page/tabbed-pages.routes')
	},
	{
		path: '**',
		redirectTo: 'invalid'
	}
];
