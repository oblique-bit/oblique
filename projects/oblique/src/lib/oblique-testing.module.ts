import {NgModule} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslateService} from './_mocks/mock-translate.service';
import {ObMockTranslatePipe} from './_mocks/mock-translate.pipe';

import {ObMockAuthenticationModule} from './authentication/_mocks/mock-authentication-module';
import {ObMockCollapseModule} from './collapse/_mocks/mock-collapse.module';
import {ObMockColumnLayoutModule} from './column-layout/_mocks/mock-column-layout.module';
import {ObMockSearchBoxModule} from './search-box/_mocks/mock-search-box.module';
import {ObMockDocumentMetaModule} from './document-meta/_mocks/mock-document-meta.module';
import {ObMockDropdownModule} from './dropdown/_mocks/mock-dropdown.module';
import {ObMockErrorMessagesModule} from './error-messages/_mocks/mock-error-messages.module';
import {ObMockExternalLinkModule} from './external-link/_mocks/mock-external-link.module';
import {ObMockFileUploadModule} from './file-upload/_mocks/mock-file-upload.module';
import {ObMockFormControlStateModule} from './form-control-state/_mocks/mock-form-control-state.module';
import {ObMockIconModule} from './icon/_mocks/mock-icon.module';
import {ObMockMasterLayoutModule} from './master-layout/_mocks/mock-master-layout.module';
import {ObMockMultiselectModule} from './multiselect/_mocks/mock-multiselect.module';
import {ObMockNavTreeModule} from './nav-tree/_mocks/mock-nav-tree.module';
import {ObMockNestedFormModule} from './nested-form/_mocks/mock-nested-form.module';
import {ObMockNotificationModule} from './notification/_mocks/mock-notification.module';
import {ObMockNumberFormatModule} from './number-format/_mocks/mock-number-format.module';
import {ObMockHttpApiInterceptorModule} from './http-api-interceptor/_mocks/mock-http-api-interceptor.module';
import {ObMockOffCanvasModule} from './off-canvas/_mocks/mock-off-canvas.module';
import {ObMockPopUpModule} from './pop-up/_mocks/mock-pop-up.module';
import {ObMockPopoverModule} from './popover/_mocks/mock-popover.module';
import {ObMockSchemaValidationModule} from './schema-validation/_mocks/mock-schema-validation.module';
import {ObMockObSelectableModule} from './selectable/_mocks/mock-selectable.module';
import {ObMockScrollingModule} from './scrolling/_mocks/mock-scrolling.module';
import {ObMockSpinnerModule} from './spinner/_mocks/mock-spinner.module';
import {ObMockStickyModule} from './sticky/_mocks/mock-sticky.module';
import {ObMockTelemetryModule} from './telemetry/_mocks/mock-telemetry.module';
import {ObMockInputClearModule} from './input-clear/_mocks/mock-input-clear.module';
import {ObMockTranslateParamsModule} from './translate-params/_mocks/mock-translate-params.module';
import {ObMockUnknownRouteModule} from './unknown-route/_mocks/mock-unknown-route.module';
import {ObMockUnsavedChangesModule} from './unsaved-changes/_mocks/mock-unsaved-changes.module';
import {WINDOW} from './utilities';
import {ObMockButtonModule} from './button/_mocks/mock-button.module';
import {ObMockAlertModule} from './alert/_mocks/mock-alert.module';
import {ObMockBreadcrumbModule} from './breadcrumb/_mocks/mock-breadcrumb.module';

export {
	ObMockAuthenticationModule,
	ObMockAuthenticationConfigService,
	ObMockAuthenticationService
} from './authentication/_mocks/mock-authentication-module';
export {ObMockBreadcrumbModule, ObMockBreadcrumbComponent} from './breadcrumb/_mocks/mock-breadcrumb.module';
export {ObMockButtonModule, ObMockButtonDirective} from './button/_mocks/mock-button.module';
export {ObMockCollapseModule, ObMockCollapseComponent} from './collapse/_mocks/mock-collapse.module';
export {ObMockColumnLayoutComponent, ObMockColumnLayoutModule} from './column-layout/_mocks/mock-column-layout.module';
export {
	ObMockDateFormatterPipe,
	ObMockDatepickerComponent,
	ObMockDatepickerConfigService,
	ObMockDatepickerI18nService,
	ObMockDatepickerModule,
	ObMockDatepickerPlaceholderDirective
} from './datepicker/_mocks/mock-datepicker.module';
export {ObMockDocumentMetaModule, ObDocumentMetaService} from './document-meta/_mocks/mock-document-meta.module';
export {ObMockDropdownModule, ObMockDropdownComponent} from './dropdown/_mocks/mock-dropdown.module';
export {
	ObMockErrorMessagesModule,
	ObMockErrorMessagesService,
	ObMockErrorMessagesComponent,
	ObMockErrorMessagesDirective,
	ObMockMatErrorDirective
} from './error-messages/_mocks/mock-error-messages.module';
export {ObMockExternalLinkDirective, ObMockExternalLinkModule} from './external-link/_mocks/mock-external-link.module';
export {
	ObMockFileInfoComponent,
	ObMockFileUploadModule,
	ObMockFileUploadService,
	ObMockFileUploadComponent,
	ObMockDropZoneComponent
} from './file-upload/_mocks/mock-file-upload.module';
export {ObMockFormControlStateModule, ObMockFormControlStateDirective} from './form-control-state/_mocks/mock-form-control-state.module';
export {ObMockDatePipe, ObMockLanguageModule} from './language/_mocks/mock-language.module';
export {ObMockIconModule, ObMockIconService, ObMockIconComponent} from './icon/_mocks/mock-icon.module';
export {ObMockInputClearModule, ObMockInputClearDirective} from './input-clear/_mocks/mock-input-clear.module';
export {
	ObMockMasterLayoutModule,
	ObMockMasterLayoutConfig,
	ObMockMasterLayoutNavigationService,
	ObMockMasterLayoutHeaderService,
	ObMockMasterLayoutFooterService,
	ObMockMasterLayoutComponent,
	ObMockMasterLayoutFooterComponent,
	ObMockMasterLayoutHeaderComponent,
	ObMockMasterLayoutHeaderToggleDirective,
	ObMockMasterLayoutNavigationComponent,
	ObMockMasterLayoutNavigationItemDirective,
	ObMockMasterLayoutNavigationMenuDirective,
	ObMockMasterLayoutNavigationToggleDirective,
	ObMockMasterLayoutService,
	ObMockMasterLayoutComponentService,
	ObMockAriaMenuButtonDirective
} from './master-layout/_mocks/mock-master-layout.module';
export {
	ObMockMultiselectModule,
	ObMockMultiselectTexts,
	ObMockMultiselectConfig,
	ObMockMultiselectComponent,
	ObMockMultiselectSearchPipe
} from './multiselect/_mocks/mock-multiselect.module';
export {ObMockNavTreeModule, ObMockNavTreeComponent, ObMockNavTreeFakeFocusDirective} from './nav-tree/_mocks/mock-nav-tree.module';
export {ObMockParentFormDirective, ObMockNestedFormModule, ObMockNestedFormComponent} from './nested-form/_mocks/mock-nested-form.module';
export {
	ObMockNotificationModule,
	ObMockNotificationService,
	ObMockNotificationComponent,
	ObMockNotificationConfig
} from './notification/_mocks/mock-notification.module';
export {ObMockNumberFormatModule, ObMockNumberFormatDirective} from './number-format/_mocks/mock-number-format.module';
export {ObMockPopUpModule, ObMockPopUpService} from './pop-up/_mocks/mock-pop-up.module';
export {ObMockPopoverDirective, ObMockPopoverModule} from './popover/_mocks/mock-popover.module';
export {
	ObMockHttpApiInterceptorModule,
	ObMockHttpApiInterceptor,
	ObMockHttpApiInterceptorConfig,
	ObMockHttpApiInterceptorEvents
} from './http-api-interceptor/_mocks/mock-http-api-interceptor.module';
export {
	ObMockOffCanvasModule,
	ObMockOffCanvasBackdropDirective,
	ObMockOffCanvasContainerDirective,
	ObMockOffCanvasService,
	ObMockOffCanvasToggleDirective
} from './off-canvas/_mocks/mock-off-canvas.module';
export {ObMockSearchBoxComponent, ObMockSearchBoxModule, ObMockSearchBoxDirective} from './search-box/_mocks/mock-search-box.module';
export {
	ObMockSchemaValidationModule,
	ObMockSchemaRequiredDirective,
	ObMockSchemaValidateDirective,
	ObMockSchemaValidationDirective,
	ObMockSchemaValidationService
} from './schema-validation/_mocks/mock-schema-validation.module';
export {
	ObMockSelectableDirective,
	ObMockSelectableGroupDirective,
	ObMockObSelectableModule
} from './selectable/_mocks/mock-selectable.module';
export {ObMockScrollingModule, ObMockScrollingEvents, ObMockTopControlComponent} from './scrolling/_mocks/mock-scrolling.module';
export {ObMockSpinnerModule, ObMockSpinnerComponent, ObMockSpinnerService} from './spinner/_mocks/mock-spinner.module';
export {ObMockStickyModule, ObMockStickyComponent} from './sticky/_mocks/mock-sticky.module';
export {ObMockTelemetryModule, ObMockTelemetryService} from './telemetry/_mocks/mock-telemetry.module';
export {ObMockTranslateParamsModule, ObMockTranslateParamsPipe} from './translate-params/_mocks/mock-translate-params.module';
export {ObMockUnknownRouteModule, ObMockUnknownRouteComponent} from './unknown-route/_mocks/mock-unknown-route.module';
export {
	ObMockUnsavedChangesModule,
	ObMockUnsavedChangesGuard,
	ObMockUnsavedChangesDirective,
	ObMockUnsavedChangesService
} from './unsaved-changes/_mocks/mock-unsaved-changes.module';
export {ObMockTranslateService} from './_mocks/mock-translate.service';
export {ObMockTranslatePipe} from './_mocks/mock-translate.pipe';

export {ObMockAlertModule, ObMockAlertComponent} from './alert/_mocks/mock-alert.module';

const MOCK_OBLIQUE_MODULES = [
	ObMockAlertModule,
	ObMockAuthenticationModule,
	ObMockBreadcrumbModule,
	ObMockButtonModule,
	ObMockCollapseModule,
	ObMockColumnLayoutModule,
	ObMockDocumentMetaModule,
	ObMockDropdownModule,
	ObMockErrorMessagesModule,
	ObMockExternalLinkModule,
	ObMockFileUploadModule,
	ObMockFormControlStateModule,
	ObMockHttpApiInterceptorModule,
	ObMockIconModule,
	ObMockMasterLayoutModule,
	ObMockMultiselectModule,
	ObMockNavTreeModule,
	ObMockNestedFormModule,
	ObMockNotificationModule,
	ObMockNumberFormatModule,
	ObMockOffCanvasModule,
	ObMockPopUpModule,
	ObMockPopoverModule,
	ObMockSchemaValidationModule,
	ObMockScrollingModule,
	ObMockSearchBoxModule,
	ObMockObSelectableModule,
	ObMockSpinnerModule,
	ObMockStickyModule,
	ObMockTelemetryModule,
	ObMockInputClearModule,
	ObMockTranslateParamsModule,
	ObMockUnknownRouteModule,
	ObMockUnsavedChangesModule
];

/**
 * @deprecated since version 9.0.0. It will be removed with Oblique 10. Real implementation of Oblique Modules should be used instead.
 */
@NgModule({
	imports: MOCK_OBLIQUE_MODULES,
	exports: [...MOCK_OBLIQUE_MODULES, ObMockTranslatePipe],
	declarations: [ObMockTranslatePipe],
	providers: [
		{provide: TranslateService, useClass: ObMockTranslateService},
		{provide: WINDOW, useValue: window}
	]
})
export class ObliqueTestingModule {}
