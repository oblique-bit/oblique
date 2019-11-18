import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UnknownRouteModule} from 'oblique';
import {HomePageComponent} from './home/home.page';
import {StylesComponent} from './styles/styles.component';

const appRoutes: Routes = [
	{path: 'home', component: HomePageComponent, data: {title: 'i18n.routes.home.title'}},
	{path: 'samples', loadChildren: () => import('./samples/samples.module').then(m => m.SamplesModule)},
	{path: 'bootstrap', loadChildren: () => import('./bootstrap/bootstrap.module').then(m => m.BootstrapModule)},
	{path: 'styles', component: StylesComponent},
	{path: '', redirectTo: 'home', pathMatch: 'full'},
	{path: '**', redirectTo: 'unknown-route'}
];
@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes),
		UnknownRouteModule
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule {
}
