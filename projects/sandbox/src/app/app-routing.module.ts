import {NgModule} from '@angular/core';
import {RouterModule, type Routes} from '@angular/router';

import {ObUnknownRouteModule} from '@oblique/oblique';
import {HomePageComponent} from './home/home.page';

const appRoutes: Routes = [
	{path: 'home', component: HomePageComponent, data: {title: 'i18n.routes.home.title'}},
	{path: 'samples', loadChildren: async () => import('./samples/samples.module').then(module => module.SamplesModule)},
	{
		path: 'material',
		loadChildren: async () => import('./material/material.module').then(module => module.MaterialModule),
	},
	{path: 'styles', loadChildren: async () => import('./styles/styles.module').then(module => module.StylesModule)},
	{
		path: 'starterkit',
		loadChildren: async () => import('./starterkit/starterkit.module').then(module => module.StarterkitModule),
	},
	{
		path: 'design-system',
		loadChildren: async () => import('./design-system/design-system.module').then(module => module.DesignSystemModule),
	},
	{path: '', redirectTo: 'home', pathMatch: 'full'},
	{path: '**', redirectTo: 'unknown-route'},
];
@NgModule({
	imports: [RouterModule.forRoot(appRoutes), ObUnknownRouteModule],
	exports: [RouterModule],
})
export class AppRoutingModule {}
