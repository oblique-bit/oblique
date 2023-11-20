import {Routes} from '@angular/router';
import {URL_CONST} from './app/shared/url/url.const';

export const APP_ROUTES: Routes = [
	{path: '', redirectTo: 'introductions/welcome', pathMatch: 'full'},
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
		path: `internationalization/:${URL_CONST.urlParams.selectedSlug}`,
		loadChildren: () => import('./app/tabbed-page/tabbed-pages.routes')
	},
	{
		path: `components/:${URL_CONST.urlParams.selectedSlug}`,
		loadChildren: () => import('./app/tabbed-page/tabbed-pages.routes')
	}
];
