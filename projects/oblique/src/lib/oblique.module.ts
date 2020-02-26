import {NgModule} from '@angular/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

import {ObColumnLayoutModule} from './column-layout/column-layout.module';
import {ObDocumentMetaModule} from './document-meta/document-meta.module';
import {ObDropdownModule} from './dropdown/dropdown.module';
import {ObErrorMessagesModule} from './error-messages/error-messages.module';
import {ObFilterBoxModule} from './filter-box/filter-box.module';
import {ObFormControlStateModule} from './form-control-state/form-control-state.module';
import {ObMasterLayoutModule} from './master-layout/master-layout.module';
import {ObMultiselectModule} from './multiselect/multiselect.module';
import {ObNavigatorModule} from './navigator/navigator.module';
import {ObNavigableModule} from './navigable/navigable.module';
import {ObNavTreeModule} from './nav-tree/nav-tree.module';
import {ObNestedFormModule} from './nested-form/nested-form.module';
import {ObNotificationModule} from './notification/notification.module';
import {ObHttpApiInterceptorModule} from './http-api-interceptor/http-api-interceptor.module';
import {ObSchemaValidationModule} from './schema-validation/schema-validation.module';
import {ObScrollingModule} from './scrolling/scrolling.module';
import {ObSpinnerModule} from './spinner/spinner.module';
import {ObSelectableModule} from './selectable/selectable.module';
import {ObInputClearModule} from './input-clear/input-clear.module';
import {ObToggleModule} from './toggle/toggle.module';
import {ObTranslateParamsModule} from './translate-params/translate-params.module';
import {ObUnsavedChangesModule} from './unsaved-changes/unsaved-changes.module';
import {ObNumberFormatModule} from './number-format/number-format.module';
import {ObOffCanvasModule} from './off-canvas/off-canvas.module';
import {ObSearchBoxModule} from './search-box/search-box.module';
import {ObStickyModule} from './sticky/sticky.module';
import {ObUnknownRouteModule} from './unknown-route/unknown-route.module';
import {ObTelemetryService} from './telemetry/telemetry.service';
import {requireAndRecordTelemetry} from './telemetry/telemetry-require';
import {WINDOW, windowProvider} from './utilities';

const OBLIQUE_MODULES = [
	ObColumnLayoutModule,
	ObDocumentMetaModule,
	ObDropdownModule,
	ObErrorMessagesModule,
	ObFilterBoxModule,
	ObFormControlStateModule,
	ObMasterLayoutModule,
	ObMultiselectModule,
	ObNavigableModule,
	ObNavigatorModule,
	ObNavTreeModule,
	ObNestedFormModule,
	ObNotificationModule,
	ObNumberFormatModule,
	ObHttpApiInterceptorModule,
	ObOffCanvasModule,
	ObSchemaValidationModule,
	ObScrollingModule,
	ObSearchBoxModule,
	ObSelectableModule,
	ObSpinnerModule,
	ObStickyModule,
	ObInputClearModule,
	ObToggleModule,
	ObTranslateParamsModule,
	ObUnknownRouteModule,
	ObUnsavedChangesModule
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
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObliqueModule);
	}
}
