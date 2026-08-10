import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {ObUnknownRouteComponent} from './unknown-route.component';

export {ObUnknownRouteComponent} from './unknown-route.component';

@NgModule({
	imports: [
		CommonModule,
		ObUnknownRouteComponent,
		RouterModule.forChild([
			{path: 'unknown-route', component: ObUnknownRouteComponent},
			// TODO uncomment once https://github.com/angular/angular/issues/12648 is fixed
			// {path: '**', redirectTo: 'unknown-route'}
		]),
		TranslatePipe,
	],
	exports: [ObUnknownRouteComponent],
})
export class ObUnknownRouteModule {}
