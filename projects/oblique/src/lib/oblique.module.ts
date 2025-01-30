import {NgModule} from '@angular/core';
import {ObButtonModule} from './button/button.module';
import {ObCollapseModule} from './collapse/collapse.module';
import {ObColumnLayoutModule} from './column-layout/column-layout.module';
import {ObDocumentMetaModule} from './document-meta/document-meta.module';
import {ObErrorMessagesModule} from './error-messages/error-messages.module';
import {ObFileUploadModule} from './file-upload/file-upload.module';
import {ObMasterLayoutModule} from './master-layout/master-layout.module';
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
import {ObStickyModule} from './sticky/sticky.module';
import {ObUnknownRouteModule} from './unknown-route/unknown-route.module';
import {obliqueProviders} from './utilities';
import {ObLanguageModule} from './language/language.module';
import {ObExternalLinkModule} from './external-link/external-link.module';
import {ObAlertModule} from './alert/alert.module';
import {ObBreadcrumbModule} from './breadcrumb/breadcrumb.module';
import {ObServiceNavigationModule} from './service-navigation/service-navigation.module';

const OBLIQUE_MODULES = [
	ObAlertModule,
	ObButtonModule,
	ObBreadcrumbModule,
	ObCollapseModule,
	ObColumnLayoutModule,
	ObDocumentMetaModule,
	ObErrorMessagesModule,
	ObFileUploadModule,
	ObLanguageModule,
	ObMasterLayoutModule,
	ObNavTreeModule,
	ObNestedFormModule,
	ObNotificationModule,
	ObNumberFormatModule,
	ObHttpApiInterceptorModule,
	ObOffCanvasModule,
	ObPopoverModule,
	ObSchemaValidationModule,
	ObScrollingModule,
	ObServiceNavigationModule,
	ObSelectableModule,
	ObSpinnerModule,
	ObStickyModule,
	ObInputClearModule,
	ObTranslateParamsModule,
	ObUnknownRouteModule,
	ObUnsavedChangesModule,
	ObExternalLinkModule
];

@NgModule({
	imports: OBLIQUE_MODULES,
	providers: obliqueProviders(),
	exports: OBLIQUE_MODULES
})
export class ObliqueModule {}
