import {A11yModule} from '@angular/cdk/a11y';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
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
	ObErrorMessagesModule,
	ObExternalLinkModule,
	ObFileUploadModule,
	ObFocusInvalidModule,
	ObInputClearModule,
	ObLanguageModule,
	ObNavTreeModule,
	ObNestedFormModule,
	ObNotificationModule,
	ObNumberFormatModule,
	ObPopoverModule,
	ObSchemaValidationModule,
	ObSelectableModule,
	ObServiceNavigationModule,
	ObSpinnerModule,
	ObUnknownRouteModule,
	ObUnsavedChangesModule
} from '@oblique/oblique';
import {NestedFormChildTDSampleComponent} from './nested-form/nested-form-child-td-sample.component';
import {NestedFormGrandChildTDSampleComponent} from './nested-form/nested-form-grandchild-td-sample.component';
import {MultiTranslateLoaderSampleComponent} from './multi-translate-loader/multi-translate-loader-sample.component';
import {SelectableSampleComponent} from './selectable/selectable-sample.component';
import {SelectableFormSampleComponent} from './selectable-form/selectable-form-sample.component';
import {SpinnerSampleComponent} from './spinner-sample/spinner-sample.component';
import {LanguageSampleComponent} from './language/language-sample.component';
import {PopoverComponent} from './popover/popover.component';
import {AlertSampleComponent} from './alert/alert.component';
import {HorizontalFormsSampleComponent} from './horizontal-forms/horizontal-forms.component';
import {BreadcrumbSampleComponent} from './breadcrumb/breadcrumb.component';
import {FileUploadSampleComponent} from './file-upload-sample/file-upload-sample.component';
import {AutocompleteSampleComponent} from './autocomplete/autocomplete.component';
import {ServiceNavigationSampleComponent} from './service-navigation/service-navigation-sample.component';
import {RxjsOperatorsComponent} from './rxjs-operators/rxjs-operators.component';
import {FocusSampleComponent} from './focus/focus-sample.component';
import {FocusInvalidSampleComponent} from './focus-invalid/focus-invalid-sample.component';
import {ObTourSampleComponent} from './ob-tour/ob-tour-sample.component';
import {TourMenuComponent} from '@oblique/ob-tour';

@NgModule({
	imports: [
		A11yModule,
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		ObDatepickerModule,
		MatDialogModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatRadioModule,
		MatSelectModule,
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
		ObFocusInvalidModule,
		ObInputClearModule,
		ObLanguageModule,
		ObNavTreeModule,
		ObNestedFormModule,
		ObNotificationModule,
		ObNumberFormatModule,
		ObPopoverModule,
		ObSchemaValidationModule,
		ObSelectableModule,
		ObServiceNavigationModule,
		ObSpinnerModule,
		ObUnknownRouteModule,
		ObUnsavedChangesModule,
		ReactiveFormsModule,
		RouterModule,
		SamplesRoutingModule,
		TranslateModule,
		TourMenuComponent
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
		FocusInvalidSampleComponent,
		FocusSampleComponent,
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
		RxjsOperatorsComponent,
		SchemaValidationSampleComponent,
		SelectableFormSampleComponent,
		SelectableSampleComponent,
		ServiceNavigationSampleComponent,
		SpinnerSampleComponent,
		UnknownRouteSampleComponent,
		UnsavedChangesSampleComponent,
		ObTourSampleComponent
	],
	exports: [RouterModule],
	providers: [SampleDataResolver]
})
export class SamplesModule {}
