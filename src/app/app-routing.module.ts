import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomePageComponent} from './home/home.page';

const appRoutes: Routes = [
	{path: 'home', component: HomePageComponent, data: {title: 'i18n.routes.home.title'}},
	{path: 'samples', loadChildren: () => import('./samples/samples.module').then(m => m.SamplesModule)},
	{path: '', redirectTo: 'home', pathMatch: 'full'}
];
@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes)
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule {
}
