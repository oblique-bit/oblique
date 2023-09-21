import {Routes} from '@angular/router';
import {URL_CONST} from './app/shared/url/url.const';

export const APP_ROUTES: Routes = [
	{path: '', redirectTo: 'introductions/welcome', pathMatch: 'full'},
	{
		path: `introductions/:${URL_CONST.urlParams.selectedSlug}`,
		loadChildren: () => import('./app/documentation-pages/documentation-pages.routes')
	},
	{
		path: `guidelines/:${URL_CONST.urlParams.selectedSlug}`,
		loadChildren: () => import('./app/documentation-pages/documentation-pages.routes')
	},
	{
		path: `foundations/:${URL_CONST.urlParams.selectedSlug}`,
		loadChildren: () => import('./app/documentation-pages/documentation-pages.routes')
	},
	{
		path: `components/:${URL_CONST.urlParams.selectedSlug}`,
		loadChildren: () => import('./app/component-pages/component-pages.routes')
	}
];
