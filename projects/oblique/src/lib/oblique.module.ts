import {NgModule} from '@angular/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

import {ColumnLayoutModule} from './column-layout/column-layout.module';
import {DocumentMetaModule} from './document-meta/document-meta.module';
import {DropdownModule} from './dropdown/dropdown.module';
import {ErrorMessagesModule} from './error-messages/error-messages.module';
import {FilterBoxModule} from './filter-box/filter-box.module';
import {FormControlStateModule} from './form-control-state/form-control-state.module';
import {MasterLayoutModule} from './master-layout/master-layout.module';
import {MultiselectModule} from './multiselect/multiselect.module';
import {NavigatorModule} from './navigator/navigator.module';
import {NavigableModule} from './navigable/navigable.module';
import {NavTreeModule} from './nav-tree/nav-tree.module';
import {NestedFormModule} from './nested-form/nested-form.module';
import {NotificationModule} from './notification/notification.module';
import {ObliqueHttpModule} from './http/oblique-http.module';
import {SchemaValidationModule} from './schema-validation/schema-validation.module';
import {ScrollingModule} from './scrolling/scrolling.module';
import {SpinnerModule} from './spinner/spinner.module';
import {ObSelectableModule} from './selectable/selectable.module';
import {InputClearModule} from './input-clear/input-clear.module';
import {ToggleModule} from './toggle/toggle.module';
import {TranslateParamsModule} from './translate-params/translate-params.module';
import {UnsavedChangesModule} from './unsaved-changes/unsaved-changes.module';
import {NumberFormatModule} from './number-format/number-format.module';
import {OffCanvasModule} from './off-canvas/off-canvas.module';
import {SearchBoxModule} from './search-box/search-box.module';
import {StickyModule} from './sticky/sticky.module';
import {UnknownRouteModule} from './unknown-route/unknown-route.module';
import {TelemetryService} from './telemetry/telemetry.service';
import {requireAndRecordTelemetry} from './telemetry/telemetry-require';
import {WINDOW, windowProvider} from './utilities';

const OBLIQUE_MODULES = [
	ColumnLayoutModule,
	DocumentMetaModule,
	DropdownModule,
	ErrorMessagesModule,
	FilterBoxModule,
	FormControlStateModule,
	MasterLayoutModule,
	MultiselectModule,
	NavigableModule,
	NavigatorModule,
	NavTreeModule,
	NestedFormModule,
	NotificationModule,
	NumberFormatModule,
	ObliqueHttpModule,
	OffCanvasModule,
	SchemaValidationModule,
	ScrollingModule,
	SearchBoxModule,
	ObSelectableModule,
	SpinnerModule,
	StickyModule,
	InputClearModule,
	ToggleModule,
	TranslateParamsModule,
	UnknownRouteModule,
	UnsavedChangesModule
];

@NgModule({
	imports: OBLIQUE_MODULES,
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: OBLIQUE_MODULES
})
export class ObliqueModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, ObliqueModule);
	}
}
