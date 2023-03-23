import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatLegacyRadioModule as MatRadioModule} from '@angular/material/legacy-radio';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {DateAdapter} from '@angular/material/core';
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {TranslateModule} from '@ngx-translate/core';

import {SampleDataResolver} from '../resolvers/sample-data.resolver';
import {SamplesRoutingModule} from './samples-routing.module';

import {CollapseSampleComponent} from './collapse/collapse-sample.component';
import {ColumnLayoutSampleComponent} from './column-layout/column-layout-sample.component';
import {ColumnLayoutFullHeightSampleComponent} from './column-layout-full-height/column-layout-full-height-sample.component';
import {ErrorMessagesSampleComponent} from './error-messages-sample/error-messages-sample.component';
import {ExternalLinkComponent} from './external-link/external-link.component';
import {InputClearSampleComponent} from './input-clear/input-clear.component';
import {MasterLayoutSampleComponent} from './master-layout/master-layout-sample.component';
import {NavTreeSampleComponent} from './nav-tree/nav-tree-sample.component';
import {NavTreeDetailSampleComponent} from './nav-tree/nav-tree-detail-sample.component';
import {NestedFormSampleComponent} from './nested-form/nested-form-sample.component';
import {NestedFormChildSampleComponent} from './nested-form/nested-form-child-sample.component';
import {NestedFormGrandChildSampleComponent} from './nested-form/nested-form-grandchild-sample.component';
import {NotificationSampleComponent} from './notification/notification-sample.component';
import {NumberFormatSampleComponent} from './number-format/number-format-sample.component';
import {SchemaValidationSampleComponent} from './schema-validation/schema-validation-sample.component';
import {UnknownRouteSampleComponent} from './unknown-route/unknown-route-sample.component';
import {UnsavedChangesSampleComponent} from './unsaved-changes/unsaved-changes-sample.component';
import {GlobalEventsSampleComponent} from './global-events/global-events-sample.component';
import {HttpInterceptorSampleComponent} from './http-interceptor/http-interceptor-sample.component';
import {StickySampleComponent} from './sticky/sticky-sample.component';
import {FormSampleComponent} from './form/form.component';
import {ButtonSampleComponent} from './button/button.component';
import {
	ObAlertModule,
	ObAutocompleteModule,
	ObBreadcrumbModule,
	ObButtonModule,
	ObCollapseModule,
	ObColumnLayoutModule,
	ObErrorMessagesModule,
	ObExternalLinkModule,
	ObFileUploadModule,
	ObInputClearModule,
	ObLanguageModule,
	ObLanguageService,
	ObNavTreeModule,
	ObNestedFormModule,
	ObNotificationModule,
	ObNumberFormatModule,
	ObPopoverModule,
	ObSchemaValidationModule,
	ObSearchBoxModule,
	ObSelectableModule,
	ObServiceNavigationModule,
	ObSpinnerModule,
	ObStickyModule,
	ObUnknownRouteModule,
	ObUnsavedChangesModule
} from '@oblique/oblique';
import {PopUpSampleComponent} from './pop-up/pop-up-sample.component';
import {NestedFormChildTDSampleComponent} from './nested-form/nested-form-child-td-sample.component';
import {NestedFormGrandChildTDSampleComponent} from './nested-form/nested-form-grandchild-td-sample.component';
import {MultiTranslateLoaderSampleComponent} from './multi-translate-loader/multi-translate-loader-sample.component';
import {SelectableSampleComponent} from './selectable/selectable-sample.component';
import {SpinnerSampleComponent} from './spinner-sample/spinner-sample.component';
import {LanguageSampleComponent} from './language/language-sample.component';
import {SearchBoxSampleComponent} from './search-box/search-box.component';
import {PopoverComponent} from './popover/popover.component';
import {AlertSampleComponent} from './alert/alert.component';
import {HorizontalFormsSampleComponent} from './horizontal-forms/horizontal-forms.component';
import {BreadcrumbSampleComponent} from './breadcrumb/breadcrumb.component';
import {FileUploadSampleComponent} from './file-upload-sample/file-upload-sample.component';
import {SharedModule} from '../common/shared.module';
import {AutocompleteSampleComponent} from './autocomplete/autocomplete.component';
import {ServiceNavigationSampleComponent} from './service-navigation/service-navigation-sample.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatDialogModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatMomentDateModule,
		MatRadioModule,
		MatSelectModule,
		MatSlideToggleModule,
		MatSlideToggleModule,
		MatTooltipModule,
		ObAlertModule,
		ObBreadcrumbModule.forRoot({}),
		ObAutocompleteModule,
		ObButtonModule,
		ObCollapseModule,
		ObColumnLayoutModule,
		ObErrorMessagesModule,
		ObExternalLinkModule,
		ObFileUploadModule,
		ObInputClearModule,
		ObLanguageModule,
		ObNavTreeModule,
		ObNestedFormModule,
		ObNotificationModule,
		ObNumberFormatModule,
		ObPopoverModule,
		ObSchemaValidationModule,
		ObSearchBoxModule,
		ObSelectableModule,
		ObServiceNavigationModule,
		ObSpinnerModule,
		ObStickyModule,
		ObUnknownRouteModule,
		ObUnsavedChangesModule,
		ReactiveFormsModule,
		RouterModule,
		SamplesRoutingModule,
		SharedModule,
		TranslateModule
	],
	declarations: [
		AlertSampleComponent,
		AutocompleteSampleComponent,
		BreadcrumbSampleComponent,
		ButtonSampleComponent,
		CollapseSampleComponent,
		ColumnLayoutFullHeightSampleComponent,
		ColumnLayoutSampleComponent,
		ErrorMessagesSampleComponent,
		ExternalLinkComponent,
		FileUploadSampleComponent,
		FormSampleComponent,
		GlobalEventsSampleComponent,
		HorizontalFormsSampleComponent,
		HttpInterceptorSampleComponent,
		InputClearSampleComponent,
		LanguageSampleComponent,
		MasterLayoutSampleComponent,
		MultiTranslateLoaderSampleComponent,
		NavTreeDetailSampleComponent,
		NavTreeSampleComponent,
		NestedFormChildSampleComponent,
		NestedFormChildTDSampleComponent,
		NestedFormGrandChildSampleComponent,
		NestedFormGrandChildTDSampleComponent,
		NestedFormSampleComponent,
		NotificationSampleComponent,
		NumberFormatSampleComponent,
		PopoverComponent,
		PopUpSampleComponent,
		SchemaValidationSampleComponent,
		SearchBoxSampleComponent,
		SelectableSampleComponent,
		ServiceNavigationSampleComponent,
		SpinnerSampleComponent,
		StickySampleComponent,
		UnknownRouteSampleComponent,
		UnsavedChangesSampleComponent
	],
	exports: [RouterModule],
	providers: [SampleDataResolver]
})
export class SamplesModule {
	constructor(language: ObLanguageService, adapter: DateAdapter<any>) {
		language.setLocaleOnAdapter(adapter);
	}
}
