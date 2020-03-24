import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

import {ObNavigableDirective} from './navigable.directive';
import {ObNavigableGroupComponent} from './navigable-group.component';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {
	ObNavigableDirective,
	ObNavigableOnChangeEvent,
	ObNavigableOnMoveEvent,
	ObPreventableEvent
} from './navigable.directive';
export {ObNavigableGroupComponent} from './navigable-group.component';

/**
 * @deprecated since version 5.0.0. This module is complex, buggy and never used as intended. It will be removed without replacement in future version.
 * If you have a use case for it, please contact oblique@bit.admin.ch.
 * * to use the keyboard navigation, add a <code>tabindex</code> on each element and navigate with <kbd>tab</tbd> or <kbd>shift</tbd> + <kbd>tab</tbd>
 * * to use the hover effect on buttons use the <code>hover-visible</code> class.
 * * to use the multiple items selection, use the <code>obSelectable</code> directive
 * * the items reordering feature will be lost, but is incomplete anyway
 */
@NgModule({
	imports: [
		CommonModule
	],
	declarations: [ObNavigableDirective, ObNavigableGroupComponent],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [ObNavigableDirective, ObNavigableGroupComponent]
})
export class ObNavigableModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObNavigableModule);
	}
}
