import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {DateAdapter} from '@angular/material/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {SampleDataResolver} from '../resolvers/sample-data.resolver';
import {SamplesRoutingModule} from './samples-routing.module';

import {CollapseSampleComponent} from './collapse/collapse-sample.component';
import {ColumnLayoutSampleComponent} from './column-layout/column-layout-sample.component';
import {ColumnLayoutFullHeightSampleComponent} from './column-layout-full-height/column-layout-full-height-sample.component';
import {DatepickerSampleComponent} from './datepicker-sample/datepicker-sample.component';
import {ErrorMessagesSampleComponent} from './error-messages-sample/error-messages-sample.component';
import {ExternalLinkComponent} from './external-link/external-link.component';
import {FormControlStateSampleComponent} from './form-control-state-sample/form-control-state-sample.component';
import {InputClearSampleComponent} from './input-clear/input-clear.component';
import {MasterLayoutSampleComponent} from './master-layout/master-layout-sample.component';
import {MultiselectSampleComponent} from './multiselect/multiselect-sample.component';
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
import {UnsavedChangesSampleModalComponent} from './unsaved-changes/unsaved-changes-sample-modal.component';
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
	ObDatepickerModule,
	ObDropdownModule,
	ObErrorMessagesModule,
	ObExternalLinkModule,
	ObFileUploadModule,
	ObFormControlStateModule,
	ObInputClearModule,
	ObLanguageModule,
	ObLanguageService,
	ObMultiselectModule,
	ObNavTreeModule,
	ObNestedFormModule,
	ObNotificationModule,
	ObNumberFormatModule,
	ObPopoverModule,
	ObSchemaValidationModule,
	ObSearchBoxModule,
	ObSelectableModule,
	ObSpinnerModule,
	ObStickyModule,
	ObUnknownRouteModule,
	ObUnsavedChangesModule,
	ObUnsavedChangesTabsModule
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
import {DropdownSampleComponent} from './dropdown/dropdown.component';
import {AutocompleteSampleComponent} from './autocomplete/autocomplete.component';

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
		NgbModule,
		ObAlertModule,
		ObBreadcrumbModule.forRoot({}),
		ObAutocompleteModule,
		ObButtonModule,
		ObCollapseModule,
		ObColumnLayoutModule,
		ObDatepickerModule,
		ObDropdownModule,
		ObErrorMessagesModule,
		ObExternalLinkModule,
		ObFileUploadModule,
		ObFormControlStateModule,
		ObInputClearModule,
		ObLanguageModule,
		ObMultiselectModule,
		ObNavTreeModule,
		ObNestedFormModule,
		ObNotificationModule,
		ObNumberFormatModule,
		ObPopoverModule,
		ObSchemaValidationModule,
		ObSearchBoxModule,
		ObSelectableModule,
		ObSpinnerModule,
		ObStickyModule,
		ObUnknownRouteModule,
		ObUnsavedChangesModule,
		ObUnsavedChangesTabsModule,
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
		DatepickerSampleComponent,
		DropdownSampleComponent,
		ErrorMessagesSampleComponent,
		ExternalLinkComponent,
		FileUploadSampleComponent,
		FormControlStateSampleComponent,
		FormSampleComponent,
		GlobalEventsSampleComponent,
		HorizontalFormsSampleComponent,
		HttpInterceptorSampleComponent,
		InputClearSampleComponent,
		LanguageSampleComponent,
		MasterLayoutSampleComponent,
		MultiselectSampleComponent,
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
		SpinnerSampleComponent,
		StickySampleComponent,
		UnknownRouteSampleComponent,
		UnsavedChangesSampleComponent,
		UnsavedChangesSampleModalComponent
	],
	exports: [RouterModule],
	providers: [SampleDataResolver]
})
export class SamplesModule {
	constructor(language: ObLanguageService, adapter: DateAdapter<any>) {
		language.setLocaleOnAdapter(adapter);
	}
}
