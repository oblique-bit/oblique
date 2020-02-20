import {NgModule} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {MockTranslateService} from './_mocks/mock-translate.service';
import {MockTranslatePipe} from './_mocks/mock-translate.pipe';
import {MockMatFormElementComponent} from './_mocks/mock-form-element.component';

import {MockColumnLayoutModule} from './column-layout/mock/mock-column-layout.module';
import {MockSearchBoxModule} from './searchbox/mock/mock-search-box.module';
import {MockDocumentMetaModule} from './document-meta/mock/mock-document-meta.module';
import {MockDropdownModule} from './dropdown/mock/mock-dropdown.module';
import {MockErrorMessagesModule} from './error-messages/mock/mock-error-messages.module';
import {MockFilterBoxModule} from './filter-box/mock/mock-filter-box.module';
import {MockFormControlStateModule} from './form-control-state/mock/mock-form-control-state.module';
import {MockMasterLayoutModule} from './master-layout/mock/mock-master-layout.module';
import {MockMultiselectModule} from './multiselect/mock/mock-multiselect.module';
import {MockNavigableModule} from './navigable/mock/mock-navigable.module';
import {MockNavigatorModule} from './navigator/mock/mock-navigator.module';
import {MockNavTreeModule} from './nav-tree/mock/mock-nav-tree.module';
import {MockNotificationModule} from './notification/mock/mock-notification.module';
import {MockNumberFormatModule} from './number-format/mock/mock-number-format.module';
import {MockObliqueHttpModule} from './http/mock/mock-oblique-http.module';
import {MockOffCanvasModule} from './off-canvas/mock/mock-off-canvas.module';
import {MockPopUpModule} from './pop-up/_mock/mock-pop-up.module';
import {MockSchemaValidationModule} from './schema-validation/mock/mock-schema-validation.module';
import {MockObSelectableModule} from './selectable/mock/mock-selectable.module';
import {MockScrollingModule} from './scrolling/mock/mock-scrolling.module';
import {MockSpinnerModule} from './spinner/mock/mock-spinner.module';
import {MockStickyModule} from './sticky/mock/mock-sticky.module';
import {MockTelemetryModule} from './telemetry/_mock/mock-telemetry.module';
import {MockTextControlClearModule} from './text-control-clear/mock/mock-text-control-clear.module';
import {MockThemeModule} from './theme/mock/mock-theme.module';
import {MockToggleModule} from './toggle/mock/mock-toggle.module';
import {MockTranslateParamsModule} from './translate-params/mock/mock-translate-params.module';
import {MockUnknownRouteModule} from './unknown-route/mock/mock-unknown-route.module';
import {MockUnsavedChangesModule} from './unsaved-changes/mock/mock-unsaved-changes.module';
import {WINDOW, windowProvider} from './utilities';

export {MockColumnLayoutComponent, MockColumnLayoutModule} from './column-layout/mock/mock-column-layout.module';
export {
	MockDateFormatterPipe,
	MockDatepickerComponent,
	MockDatepickerConfigService,
	MockDatepickerI18nService,
	MockDatepickerModule,
	MockDatepickerPlaceholderDirective
} from './datepicker/mock/mock-datepicker.module';
export {MockDocumentMetaModule, DocumentMetaService} from './document-meta/mock/mock-document-meta.module';
export {MockDropdownModule, MockDropdownComponent} from './dropdown/mock/mock-dropdown.module';
export {
	MockErrorMessagesModule, MockErrorMessagesService, MockErrorMessagesComponent, MockErrorMessagesDirective, MockMatErrorDirective
} from './error-messages/mock/mock-error-messages.module';
export {MockFilterBoxModule, MockFilterBoxComponent} from './filter-box/mock/mock-filter-box.module';
export {MockFormControlStateModule, MockFormControlStateDirective} from './form-control-state/mock/mock-form-control-state.module';
export {
	MockMasterLayoutModule,
	MockMasterLayoutConfig,
	MockMasterLayoutNavigationService,
	MockMasterLayoutHeaderService,
	MockMasterLayoutFooterService,
	MockMasterLayoutComponent,
	MockMasterLayoutFooterComponent,
	MockMasterLayoutHeaderComponent,
	MockMasterLayoutHeaderToggleDirective,
	MockMasterLayoutNavigationComponent,
	MockMasterLayoutNavigationItemDirective,
	MockMasterLayoutNavigationMenuDirective,
	MockMasterLayoutNavigationToggleDirective,
	MockMasterLayoutService,
	MockMasterLayoutComponentService
} from './master-layout/mock/mock-master-layout.module';
export {
	MockMultiselectModule, MockMultiselectTexts, MockMultiselectConfig, MockMultiselectComponent, MockMultiselectSearchPipe
} from './multiselect/mock/mock-multiselect.module';
export {MockNavigableModule, MockNavigableDirective, MockNavigableGroupComponent} from './navigable/mock/mock-navigable.module';
export {MockNavigatorModule, MockNavigatorComponent} from './navigator/mock/mock-navigator.module';
export {MockNavTreeModule, MockNavTreeComponent, MockNavTreeFakeFocusDirective} from './nav-tree/mock/mock-nav-tree.module';
export {MockNotificationModule, MockNotificationService, MockNotificationComponent, MockNotificationConfig} from './notification/mock/mock-notification.module';
export {MockNumberFormatModule, MockNumberFormatDirective} from './number-format/mock/mock-number-format.module';
export {MockPopUpModule, MockPopUpService} from './pop-up/_mock/mock-pop-up.module';
export {
	MockObliqueHttpModule, MockObliqueHttpInterceptor, MockObliqueHttpInterceptorConfig, MockObliqueHttpInterceptorEvents
} from './http/mock/mock-oblique-http.module';
export {
	MockOffCanvasModule, MockOffCanvasBackdropDirective, MockOffCanvasContainerDirective, MockOffCanvasService, MockOffCanvasToggleDirective
} from './off-canvas/mock/mock-off-canvas.module';
export {
	MockSchemaValidationModule, MockSchemaRequiredDirective, MockSchemaValidateDirective, MockSchemaValidationDirective, MockSchemaValidationService
} from './schema-validation/mock/mock-schema-validation.module';
export {MockSelectableDirective, MockSelectableService} from './selectable/mock/mock-selectable.module';
export {MockScrollingModule, MockScrollingEvents, MockTopControlComponent} from './scrolling/mock/mock-scrolling.module';
export {MockSpinnerModule, MockSpinnerComponent, MockSpinnerService} from './spinner/mock/mock-spinner.module';
export {MockStickyModule, MockStickyComponent} from './sticky/mock/mock-sticky.module';
export {MockTelemetryModule, MockTelemetryService} from './telemetry/_mock/mock-telemetry.module';
export {MockTextControlClearModule, MockTextControlClearDirective} from './text-control-clear/mock/mock-text-control-clear.module';
export {MockThemeService, MockThemeModule} from './theme/mock/mock-theme.module';
export {MockToggleModule, MockToggleDirective} from './toggle/mock/mock-toggle.module';
export {MockTranslateParamsModule, MockTranslateParamsPipe} from './translate-params/mock/mock-translate-params.module';
export {MockUnknownRouteModule, MockUnknownRouteComponent} from './unknown-route/mock/mock-unknown-route.module';
export {
	MockUnsavedChangesModule, MockUnsavedChangesGuard, MockUnsavedChangesDirective, MockUnsavedChangesService
} from './unsaved-changes/mock/mock-unsaved-changes.module';
export {MockTranslateService};

const MOCK_OBLIQUE_MODULES = [
	MockColumnLayoutModule,
	MockDocumentMetaModule,
	MockDropdownModule,
	MockErrorMessagesModule,
	MockFilterBoxModule,
	MockFormControlStateModule,
	MockObliqueHttpModule,
	MockMasterLayoutModule,
	MockMultiselectModule,
	MockNavigableModule,
	MockNavigatorModule,
	MockNavTreeModule,
	MockNotificationModule,
	MockNumberFormatModule,
	MockOffCanvasModule,
	MockPopUpModule,
	MockSchemaValidationModule,
	MockScrollingModule,
	MockSearchBoxModule,
	MockObSelectableModule,
	MockSpinnerModule,
	MockStickyModule,
	MockTelemetryModule,
	MockTextControlClearModule,
	MockThemeModule,
	MockToggleModule,
	MockTranslateParamsModule,
	MockUnknownRouteModule,
	MockUnsavedChangesModule
];

@NgModule({
	imports: MOCK_OBLIQUE_MODULES,
	exports: [...MOCK_OBLIQUE_MODULES, MockTranslatePipe, MockMatFormElementComponent],
	declarations: [MockTranslatePipe, MockMatFormElementComponent],
	providers: [
		{provide: TranslateService, useClass: MockTranslateService},
		{provide: WINDOW, useFactory: windowProvider}
	]
})
export class ObliqueTestingModule {
}
