import {NgModule} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslateService} from './_mocks/mock-translate.service';
import {ObMockTranslatePipe} from './_mocks/mock-translate.pipe';

import {ObMockCollapseModule} from './collapse/mock/mock-collapse.module';
import {ObMockColumnLayoutModule} from './column-layout/mock/mock-column-layout.module';
import {ObMockSearchBoxModule} from './search-box/mock/mock-search-box.module';
import {ObMockDocumentMetaModule} from './document-meta/mock/mock-document-meta.module';
import {ObMockDropdownModule} from './dropdown/mock/mock-dropdown.module';
import {ObMockErrorMessagesModule} from './error-messages/mock/mock-error-messages.module';
import {ObMockExternalLinkModule} from './external-link/mock/mock-external-link.module';
import {ObMockFormControlStateModule} from './form-control-state/mock/mock-form-control-state.module';
import {ObMockIconModule} from './icon/_mock/mock-icon.module';
import {ObMockMasterLayoutModule} from './master-layout/mock/mock-master-layout.module';
import {ObMockMultiselectModule} from './multiselect/mock/mock-multiselect.module';
import {ObMockNavTreeModule} from './nav-tree/mock/mock-nav-tree.module';
import {ObMockNotificationModule} from './notification/mock/mock-notification.module';
import {ObMockNumberFormatModule} from './number-format/mock/mock-number-format.module';
import {ObMockHttpApiInterceptorModule} from './http-api-interceptor/mock/mock-http-api-interceptor.module';
import {ObMockOffCanvasModule} from './off-canvas/mock/mock-off-canvas.module';
import {ObMockPopUpModule} from './pop-up/_mock/mock-pop-up.module';
import {ObMockPopoverDirective, ObMockPopoverModule} from './popover/_mocks/mock-popover.module';
import {ObMockSchemaValidationModule} from './schema-validation/mock/mock-schema-validation.module';
import {ObMockObSelectableModule} from './selectable/mock/mock-selectable.module';
import {ObMockScrollingModule} from './scrolling/mock/mock-scrolling.module';
import {ObMockSpinnerModule} from './spinner/mock/mock-spinner.module';
import {ObMockStickyModule} from './sticky/mock/mock-sticky.module';
import {ObMockTelemetryModule} from './telemetry/_mock/mock-telemetry.module';
import {ObMockInputClearModule} from './input-clear/mock/mock-input-clear.module';
import {ObMockThemeModule} from './theme/mock/mock-theme.module';
import {ObMockTranslateParamsModule} from './translate-params/mock/mock-translate-params.module';
import {ObMockUnknownRouteModule} from './unknown-route/mock/mock-unknown-route.module';
import {ObMockUnsavedChangesModule} from './unsaved-changes/mock/mock-unsaved-changes.module';
import {WINDOW, windowProvider} from './utilities';
import {ObMockButtonModule} from './button/mock/mock-button.module';
import {ObMockAlertModule} from './alert/mock/mock-alert.module';
import {ObMockMandatoryModule} from './mandatory/mock/mock-mandatory.module';
import {ObMockBreadcrumbModule} from './breadcrumb/mock/mock-breadcrumb.module';

export {ObMockBreadcrumbModule, ObMockBreadcrumbComponent} from './breadcrumb/mock/mock-breadcrumb.module';
export {ObMockButtonModule, ObMockButtonDirective} from './button/mock/mock-button.module';
export {ObMockCollapseModule, ObMockCollapseComponent} from './collapse/mock/mock-collapse.module';
export {ObMockColumnLayoutComponent, ObMockColumnLayoutModule} from './column-layout/mock/mock-column-layout.module';
export {
	ObMockDateFormatterPipe,
	ObMockDatepickerComponent,
	ObMockDatepickerConfigService,
	ObMockDatepickerI18nService,
	ObMockDatepickerModule,
	ObMockDatepickerPlaceholderDirective
} from './datepicker/mock/mock-datepicker.module';
export {ObMockDocumentMetaModule, ObDocumentMetaService} from './document-meta/mock/mock-document-meta.module';
export {ObMockDropdownModule, ObMockDropdownComponent} from './dropdown/mock/mock-dropdown.module';
export {
	ObMockErrorMessagesModule,
	ObMockErrorMessagesService,
	ObMockErrorMessagesComponent,
	ObMockErrorMessagesDirective,
	ObMockMatErrorDirective
} from './error-messages/mock/mock-error-messages.module';
export {ObMockExternalLinkDirective, ObMockExternalLinkModule} from './external-link/mock/mock-external-link.module';
export {ObMockFormControlStateModule, ObMockFormControlStateDirective} from './form-control-state/mock/mock-form-control-state.module';
export {ObMockDatePipe, ObMockLanguageModule} from './language/mock/mock-language.module';
export {ObMockIconModule, ObMockIconService, ObMockIconComponent} from './icon/_mock/mock-icon.module';
export {ObMockInputClearModule, ObMockInputClearDirective} from './input-clear/mock/mock-input-clear.module';
export {ObMockMandatoryModule, ObMockMandatoryDirective} from './mandatory/mock/mock-mandatory.module';
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
} from './master-layout/mock/mock-master-layout.module';
export {
	ObMockMultiselectModule,
	ObMockMultiselectTexts,
	ObMockMultiselectConfig,
	ObMockMultiselectComponent,
	ObMockMultiselectSearchPipe
} from './multiselect/mock/mock-multiselect.module';
export {ObMockNavTreeModule, ObMockNavTreeComponent, ObMockNavTreeFakeFocusDirective} from './nav-tree/mock/mock-nav-tree.module';
export {
	ObMockNotificationModule,
	ObMockNotificationService,
	ObMockNotificationComponent,
	ObMockNotificationConfig
} from './notification/mock/mock-notification.module';
export {ObMockNumberFormatModule, ObMockNumberFormatDirective} from './number-format/mock/mock-number-format.module';
export {ObMockPopUpModule, ObMockPopUpService} from './pop-up/_mock/mock-pop-up.module';
export {ObMockPopoverDirective, ObMockPopoverModule} from './popover/_mocks/mock-popover.module';
export {
	ObMockHttpApiInterceptorModule,
	ObMockHttpApiInterceptor,
	ObMockHttpApiInterceptorConfig,
	ObMockHttpApiInterceptorEvents
} from './http-api-interceptor/mock/mock-http-api-interceptor.module';
export {
	ObMockOffCanvasModule,
	ObMockOffCanvasBackdropDirective,
	ObMockOffCanvasContainerDirective,
	ObMockOffCanvasService,
	ObMockOffCanvasToggleDirective
} from './off-canvas/mock/mock-off-canvas.module';
export {ObMockSearchBoxComponent, ObMockSearchBoxModule, ObMockSearchBoxDirective} from './search-box/mock/mock-search-box.module';
export {
	ObMockSchemaValidationModule,
	ObMockSchemaRequiredDirective,
	ObMockSchemaValidateDirective,
	ObMockSchemaValidationDirective,
	ObMockSchemaValidationService
} from './schema-validation/mock/mock-schema-validation.module';
export {ObMockSelectableDirective, ObMockSelectableGroupDirective, ObMockObSelectableModule} from './selectable/mock/mock-selectable.module';
export {ObMockScrollingModule, ObMockScrollingEvents, ObMockTopControlComponent} from './scrolling/mock/mock-scrolling.module';
export {ObMockSpinnerModule, ObMockSpinnerComponent, ObMockSpinnerService} from './spinner/mock/mock-spinner.module';
export {ObMockStickyModule, ObMockStickyComponent} from './sticky/mock/mock-sticky.module';
export {ObMockTelemetryModule, ObMockTelemetryService} from './telemetry/_mock/mock-telemetry.module';
export {ObMockThemeService, ObMockThemeModule} from './theme/mock/mock-theme.module';
export {ObMockTranslateParamsModule, ObMockTranslateParamsPipe} from './translate-params/mock/mock-translate-params.module';
export {ObMockUnknownRouteModule, ObMockUnknownRouteComponent} from './unknown-route/mock/mock-unknown-route.module';
export {
	ObMockUnsavedChangesModule,
	ObMockUnsavedChangesGuard,
	ObMockUnsavedChangesDirective,
	ObMockUnsavedChangesService
} from './unsaved-changes/mock/mock-unsaved-changes.module';
export {ObMockTranslateService} from './_mocks/mock-translate.service';
export {ObMockTranslatePipe} from './_mocks/mock-translate.pipe';

export {ObMockAlertModule, ObMockAlertComponent} from './alert/mock/mock-alert.module';

const MOCK_OBLIQUE_MODULES = [
	ObMockAlertModule,
	ObMockBreadcrumbModule,
	ObMockButtonModule,
	ObMockCollapseModule,
	ObMockColumnLayoutModule,
	ObMockDocumentMetaModule,
	ObMockDropdownModule,
	ObMockErrorMessagesModule,
	ObMockExternalLinkModule,
	ObMockFormControlStateModule,
	ObMockHttpApiInterceptorModule,
	ObMockIconModule,
	ObMockMandatoryModule,
	ObMockMasterLayoutModule,
	ObMockMultiselectModule,
	ObMockNavTreeModule,
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
	ObMockThemeModule,
	ObMockTranslateParamsModule,
	ObMockUnknownRouteModule,
	ObMockUnsavedChangesModule
];

@NgModule({
	imports: MOCK_OBLIQUE_MODULES,
	exports: [...MOCK_OBLIQUE_MODULES, ObMockTranslatePipe],
	declarations: [ObMockTranslatePipe],
	providers: [
		{provide: TranslateService, useClass: ObMockTranslateService},
		{provide: WINDOW, useFactory: windowProvider}
	]
})
export class ObliqueTestingModule {}
