import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {TranslateModule} from '@ngx-translate/core';

import {ObColumnLayoutComponent} from './column-layout.component';
import {ObColumnToggleDirective} from './column-toggle.directive';
import {ObColumnPanelDirective} from './column-panel.directive';

import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {WINDOW, windowProvider} from '../utilities';

export {ObColumnLayoutComponent} from './column-layout.component';
export {ObColumnPanelDirective} from './column-panel.directive';
export {ObColumnToggleDirective} from './column-toggle.directive';

@NgModule({
	imports: [CommonModule, TranslateModule],
	declarations: [ObColumnLayoutComponent, ObColumnPanelDirective, ObColumnToggleDirective],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [ObColumnLayoutComponent, ObColumnPanelDirective, ObColumnToggleDirective]
})
export class ObColumnLayoutModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObColumnLayoutModule);
	}
}
