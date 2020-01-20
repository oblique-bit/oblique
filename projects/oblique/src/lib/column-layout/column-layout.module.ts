import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {TranslateModule} from '@ngx-translate/core';

import {ColumnLayoutComponent} from './column-layout.component';
import {ColumnToggleDirective} from './column-toggle.directive';
import {ColumnPanelDirective} from './column-panel.directive';

import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {TelemetryService} from '../telemetry/telemetry.service';
import {WINDOW, windowProvider} from '../utilities';

export {ColumnLayoutComponent} from './column-layout.component';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule
	],
	declarations: [
		ColumnLayoutComponent,
		ColumnPanelDirective,
		ColumnToggleDirective
	],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [
		ColumnLayoutComponent
	]
})
export class ColumnLayoutModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, ColumnLayoutModule);
	}
}
