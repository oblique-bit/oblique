import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {ObUnknownRouteComponent} from './unknown-route.component';
import {obliqueProviders} from '../utilities';

export {ObUnknownRouteComponent} from './unknown-route.component';

@NgModule({
	imports: [
		CommonModule,
		ObUnknownRouteComponent,
		RouterModule.forChild([
			{path: 'unknown-route', component: ObUnknownRouteComponent}
			// TODO uncomment once https://github.com/angular/angular/issues/12648 is fixed
			// {path: '**', redirectTo: 'unknown-route'}
		]),
		TranslateModule
	],
	providers: obliqueProviders(),
	exports: [ObUnknownRouteComponent]
})
export class ObUnknownRouteModule {}
