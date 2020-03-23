import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {ObUnknownRouteComponent} from './unknown-route.component';
import {WINDOW, windowProvider} from '../utilities';

export {ObUnknownRouteComponent} from './unknown-route.component';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		RouterModule.forChild([
			{path: 'unknown-route', component: ObUnknownRouteComponent}
			// TODO uncomment once https://github.com/angular/angular/issues/12648 is fixed
			// {path: '**', redirectTo: 'unknown-route'}
		])
	],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	declarations: [ObUnknownRouteComponent],
	exports: [ObUnknownRouteComponent]
})
export class ObUnknownRouteModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObUnknownRouteModule);
	}
}
