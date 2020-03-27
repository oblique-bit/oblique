import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';

import {ObNavTreeComponent} from './nav-tree.component';
import {ObNavTreeFakeFocusDirective} from './nav-tree-fake-focus.directive';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {ObNavTreeComponent} from './nav-tree.component';
export {ObNavTreeFakeFocusDirective} from './nav-tree-fake-focus.directive';
export {ObNavTreeItemModel} from './nav-tree-item.model';

@NgModule({
	imports: [CommonModule, NgbModule, RouterModule, TranslateModule],
	declarations: [ObNavTreeComponent, ObNavTreeFakeFocusDirective],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [ObNavTreeComponent, ObNavTreeFakeFocusDirective]
})
export class ObNavTreeModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObNavTreeModule);
	}
}
