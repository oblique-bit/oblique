import {NgModule} from '@angular/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {ParentFormDirective} from './parent-form.directive';
import {NestedFormComponent} from './nested-form.component';

export {ParentFormDirective} from './parent-form.directive';
export {NestedFormComponent} from './nested-form.component';

@NgModule({
	declarations: [
		ParentFormDirective, NestedFormComponent
	],
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
	exports: [
		ParentFormDirective, NestedFormComponent
	]
})
export class NestedFormModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, NestedFormModule);
	}
}
