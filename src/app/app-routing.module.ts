import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ObUnknownRouteModule} from 'oblique';
import {HomePageComponent} from './home/home.page';

const appRoutes: Routes = [
	{path: 'home', component: HomePageComponent, data: {title: 'i18n.routes.home.title'}},
	{path: 'samples', loadChildren: () => import('./samples/samples.module').then(m => m.SamplesModule)},
	{path: 'bootstrap', loadChildren: () => import('./bootstrap/bootstrap.module').then(m => m.BootstrapModule)},
	{path: 'material', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule)},
	{path: 'styles', loadChildren: () => import('./styles/styles.module').then(m => m.StylesModule)},
	{path: '', redirectTo: 'home', pathMatch: 'full'},
	{path: '**', redirectTo: 'unknown-route'}
];
@NgModule({
	imports: [RouterModule.forRoot(appRoutes), ObUnknownRouteModule],
	exports: [RouterModule]
})
export class AppRoutingModule {}
