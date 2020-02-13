import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';

import {NavTreeComponent} from './nav-tree.component';
import {NavTreeFakeFocusDirective} from './nav-tree-fake-focus.directive';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {NavTreeComponent} from './nav-tree.component';
export {NavTreeFakeFocusDirective} from './nav-tree-fake-focus.directive';
export {NavTreeItemModel} from './nav-tree-item.model';

@NgModule({
	imports: [
		CommonModule,
		NgbModule,
		RouterModule,
		TranslateModule
	],
	declarations: [
		NavTreeComponent,
		NavTreeFakeFocusDirective
	],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [
		NavTreeComponent,
		NavTreeFakeFocusDirective
	]
})
export class NavTreeModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, NavTreeModule);
	}
}
