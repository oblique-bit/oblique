import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';

import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {UnknownRouteComponent} from './unknown-route.component';

export {UnknownRouteComponent} from './unknown-route.component';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		RouterModule.forChild([
			{path: 'unknown-route', component: UnknownRouteComponent}
			// TODO uncomment once https://github.com/angular/angular/issues/12648 is fixed
			// {path: '**', redirectTo: 'unknown-route'}
		])
	],
	declarations: [UnknownRouteComponent],
	exports: [UnknownRouteComponent]
})
export class UnknownRouteModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, UnknownRouteModule);
	}
}
