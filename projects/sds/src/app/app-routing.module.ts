import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {URL_CONST} from './shared/url/url.const';

const routes: Routes = [
	{path: '', redirectTo: 'introductions/welcome', pathMatch: 'full'},
	{
		path: `introductions/:${URL_CONST.urlParams.selectedSlug}`,
		loadChildren: () => import('./documentation-pages/documentation-pages.module').then(module => module.DocumentationPagesModule)
	},
	{
		path: `guidelines/:${URL_CONST.urlParams.selectedSlug}`,
		loadChildren: () => import('./documentation-pages/documentation-pages.module').then(module => module.DocumentationPagesModule)
	},
	{
		path: `components/:${URL_CONST.urlParams.selectedSlug}`,
		loadChildren: () => import('./component-pages/component-pages.module').then(module => module.ComponentPagesModule)
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
