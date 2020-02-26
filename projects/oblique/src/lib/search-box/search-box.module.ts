import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

import {TranslateModule} from '@ngx-translate/core';
import {ObSearchBoxDirective} from './search-box.directive';
import {ObSearchBoxResultsComponent} from './search-box-results.component';
import {ObSearchBoxComponent} from './search-box.component';
import {ObNavTreeModule} from '../nav-tree/nav-tree.module';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {ObSearchBoxResultsComponent} from './search-box-results.component';
export {ObSearchBoxComponent, ObISearchWidgetItem} from './search-box.component';
export {ObSearchBoxDirective} from './search-box.directive';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ObNavTreeModule,
		TranslateModule,
		RouterModule
	],
	declarations: [ObSearchBoxDirective, ObSearchBoxComponent, ObSearchBoxResultsComponent],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [ObSearchBoxDirective, ObSearchBoxComponent],
	entryComponents: [ObSearchBoxResultsComponent]
})
export class ObSearchBoxModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObSearchBoxModule);
	}
}
