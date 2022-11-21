import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ObUnknownRouteModule} from '@oblique/oblique';
import {HomePageComponent} from './home/home.page';

const appRoutes: Routes = [
	{path: 'home', component: HomePageComponent, data: {title: 'i18n.routes.home.title'}},
	{path: 'samples', loadChildren: () => import('./samples/samples.module').then(module => module.SamplesModule)},
	{path: 'material', loadChildren: () => import('./material/material.module').then(module => module.MaterialModule)},
	{path: 'styles', loadChildren: () => import('./styles/styles.module').then(module => module.StylesModule)},
	{path: '', redirectTo: 'home', pathMatch: 'full'},
	{path: '**', redirectTo: 'unknown-route'}
];
@NgModule({
	imports: [RouterModule.forRoot(appRoutes, {relativeLinkResolution: 'legacy'}), ObUnknownRouteModule],
	exports: [RouterModule]
})
export class AppRoutingModule {}
