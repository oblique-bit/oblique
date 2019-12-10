import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';

import {TranslateModule} from '@ngx-translate/core';
import {SearchBoxDirective} from './search-box.directive';
import {SearchBoxResultsComponent} from './search-box-results.component';
import {SearchBoxComponent} from './search-box.component';
import {NavTreeModule} from '../nav-tree/nav-tree.module';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {SearchBoxResultsComponent} from './search-box-results.component';
export {SearchBoxComponent, SearchWidgetItem} from './search-box.component';
export {SearchBoxDirective} from './search-box.directive';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		NavTreeModule,
		TranslateModule,
		RouterModule
	],
	declarations: [SearchBoxDirective, SearchBoxComponent, SearchBoxResultsComponent],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [SearchBoxDirective, SearchBoxComponent],
	entryComponents: [SearchBoxResultsComponent]
})
export class SearchBoxModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, SearchBoxModule);
	}
}
