import {NgModule} from '@angular/core';
import {ObButtonModule} from './button/button.module';
import {ObCollapseModule} from './collapse/collapse.module';
import {ObColumnLayoutModule} from './column-layout/column-layout.module';
import {ObDocumentMetaModule} from './document-meta/document-meta.module';
import {ObDropdownModule} from './dropdown/dropdown.module';
import {ObErrorMessagesModule} from './error-messages/error-messages.module';
import {ObFormControlStateModule} from './form-control-state/form-control-state.module';
import {ObMasterLayoutModule} from './master-layout/master-layout.module';
import {ObMultiselectModule} from './multiselect/multiselect.module';
import {ObNavTreeModule} from './nav-tree/nav-tree.module';
import {ObNestedFormModule} from './nested-form/nested-form.module';
import {ObNotificationModule} from './notification/notification.module';
import {ObHttpApiInterceptorModule} from './http-api-interceptor/http-api-interceptor.module';
import {ObPopoverModule} from './popover/popover.module';
import {ObSchemaValidationModule} from './schema-validation/schema-validation.module';
import {ObScrollingModule} from './scrolling/scrolling.module';
import {ObSpinnerModule} from './spinner/spinner.module';
import {ObSelectableModule} from './selectable/selectable.module';
import {ObInputClearModule} from './input-clear/input-clear.module';
import {ObTranslateParamsModule} from './translate-params/translate-params.module';
import {ObUnsavedChangesModule} from './unsaved-changes/unsaved-changes.module';
import {ObNumberFormatModule} from './number-format/number-format.module';
import {ObOffCanvasModule} from './off-canvas/off-canvas.module';
import {ObSearchBoxModule} from './search-box/search-box.module';
import {ObStickyModule} from './sticky/sticky.module';
import {ObUnknownRouteModule} from './unknown-route/unknown-route.module';
import {ObTelemetryService} from './telemetry/telemetry.service';
import {requireAndRecordTelemetry} from './telemetry/telemetry-require';
import {obliqueProviders} from './utilities';
import {ObLanguageService} from './language/language.service';
import {ObLanguageModule} from './language/language.module';

const OBLIQUE_MODULES = [
	ObButtonModule,
	ObCollapseModule,
	ObColumnLayoutModule,
	ObDocumentMetaModule,
	ObDropdownModule,
	ObErrorMessagesModule,
	ObFormControlStateModule,
	ObLanguageModule,
	ObMasterLayoutModule,
	ObMultiselectModule,
	ObNavTreeModule,
	ObNestedFormModule,
	ObNotificationModule,
	ObNumberFormatModule,
	ObHttpApiInterceptorModule,
	ObOffCanvasModule,
	ObPopoverModule,
	ObSchemaValidationModule,
	ObScrollingModule,
	ObSearchBoxModule,
	ObSelectableModule,
	ObSpinnerModule,
	ObStickyModule,
	ObInputClearModule,
	ObTranslateParamsModule,
	ObUnknownRouteModule,
	ObUnsavedChangesModule
];

@NgModule({
	imports: OBLIQUE_MODULES,
	providers: obliqueProviders(),
	exports: OBLIQUE_MODULES
})
export class ObliqueModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObliqueModule);
	}
}
