import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {SampleDataResolver} from '../resolvers/sample-data.resolver';
import {SamplesRoutingModule} from './samples-routing.module';

import {ObCollapseSampleComponent} from './collapse/collapse-sample.component';
import {ObColumnLayoutSampleComponent} from './column-layout/column-layout-sample.component';
import {ObDatepickerSampleComponent} from './datepicker-sample/datepicker-sample.component';
import {ObErrorMessagesSampleComponent} from './error-messages-sample/error-messages-sample.component';
import {ObFormControlStateSampleComponent} from './form-control-state-sample/form-control-state-sample.component';
import {ObInputClearSampleComponent} from './input-clear/input-clear.component';
import {ObMasterLayoutSampleComponent} from './master-layout/master-layout-sample.component';
import {ObMultiselectSampleComponent} from './multiselect/multiselect-sample.component';
import {ObNavTreeDetailSampleComponent, ObNavTreeSampleComponent} from './nav-tree/nav-tree-sample.component';
import {ObNestedFormSampleComponent} from './nested-form/nested-form-sample.component';
import {ObNestedFormChildSampleComponent} from './nested-form/nested-form-child-sample.component';
import {ObNestedFormGrandChildSampleComponent} from './nested-form/nested-form-grandchild-sample.component';
import {ObNotificationSampleComponent} from './notification/notification-sample.component';
import {ObNumberFormatSampleComponent} from './number-format/number-format-sample.component';
import {ObSchemaValidationSampleComponent} from './schema-validation/schema-validation-sample.component';
import {ObUnknownRouteSampleComponent} from './unknown-route/unknown-route-sample.component';
import {ObUnsavedChangesSampleComponent} from './unsaved-changes/unsaved-changes-sample.component';
import {ObUnsavedChangesSampleModalComponent} from './unsaved-changes/unsaved-changes-sample-modal.component';
import {ObHttpInterceptorSampleComponent} from './http-interceptor/http-interceptor-sample.component';
import {ObStickySampleComponent} from './sticky/sticky-sample.component';
import {ObFormSampleComponent} from './form/form.component';
import {ObButtonSampleComponent} from './button/button.component';
import {
	ObAlertModule,
	ObButtonModule,
	ObCollapseModule,
	ObColumnLayoutModule,
	ObDatepickerModule,
	ObErrorMessagesModule,
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
} from 'oblique';
import {ObApiComponent} from '../api/api.component';
import {ObDescriptionComponent} from '../description/description.component';
import {ObApiElementComponent} from '../api/api-element.component';
import {ObPopUpSampleComponent} from './pop-up/pop-up-sample.component';
import {ObNestedFormChildTDSampleComponent} from './nested-form/nested-form-child-td-sample.component';
import {ObNestedFormGrandChildTDSampleComponent} from './nested-form/nested-form-grandchild-td-sample.component';
import {ObMultiTranslateLoaderSampleComponent} from './multi-translate-loader/multi-translate-loader-sample.component';
import {ObSelectableSampleComponent} from './selectable/selectable-sample.component';
import {ObSpinnerSampleComponent} from './spinner-sample/spinner-sample.component';
import {ObLanguageSampleComponent} from './language/language-sample.component';
import {ObSearchBoxSampleComponent} from './search-box/search-box.component';
import {DateAdapter} from '@angular/material/core';
import {ObPopoverComponent} from './popover/popover.component';
import {ObAlertSampleComponent} from './alert/alert.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
	imports: [
		CommonModule,
		ObAlertModule,
		ObCollapseModule,
		ObColumnLayoutModule,
		ObDatepickerModule,
		ObErrorMessagesModule,
		ObFormControlStateModule,
		ObLanguageModule,
		ObMultiselectModule,
		ObNavTreeModule,
		ObNestedFormModule,
		ObNumberFormatModule,
		ObNotificationModule,
		ObPopoverModule,
		ObSchemaValidationModule,
		ObSearchBoxModule,
		ObSelectableModule,
		ObSpinnerModule,
		ObStickyModule,
		ObInputClearModule,
		ObUnknownRouteModule,
		ObUnsavedChangesModule,
		ObUnsavedChangesTabsModule,
		ObButtonModule,

		TranslateModule,
		FormsModule,
		NgbModule,
		RouterModule,
		SamplesRoutingModule,
		ReactiveFormsModule,
		MatMenuModule,
		MatIconModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatSelectModule,
		MatCheckboxModule,
		MatRadioModule,
		MatDatepickerModule,
		MatMomentDateModule,
		MatSlideToggleModule
	],
	declarations: [
		ObAlertSampleComponent,
		ObButtonSampleComponent,
		ObCollapseSampleComponent,
		ObColumnLayoutSampleComponent,
		ObDatepickerSampleComponent,
		ObErrorMessagesSampleComponent,
		ObFormSampleComponent,
		ObFormControlStateSampleComponent,
		ObHttpInterceptorSampleComponent,
		ObInputClearSampleComponent,
		ObLanguageSampleComponent,
		ObMasterLayoutSampleComponent,
		ObMultiselectSampleComponent,
		ObNavTreeSampleComponent,
		ObNavTreeDetailSampleComponent,
		ObNestedFormSampleComponent,
		ObNestedFormChildSampleComponent,
		ObNestedFormChildTDSampleComponent,
		ObNestedFormGrandChildSampleComponent,
		ObNestedFormGrandChildTDSampleComponent,
		ObNotificationSampleComponent,
		ObNumberFormatSampleComponent,
		ObSchemaValidationSampleComponent,
		ObSelectableSampleComponent,
		ObStickySampleComponent,
		ObUnknownRouteSampleComponent,
		ObUnsavedChangesSampleComponent,
		ObUnsavedChangesSampleModalComponent,
		ObApiComponent,
		ObApiElementComponent,
		ObDescriptionComponent,
		ObPopUpSampleComponent,
		ObPopoverComponent,
		ObMultiTranslateLoaderSampleComponent,
		ObSpinnerSampleComponent,
		ObSearchBoxSampleComponent
	],
	exports: [RouterModule, ObApiComponent, ObDescriptionComponent],
	providers: [SampleDataResolver]
})
export class SamplesModule {
	constructor(language: ObLanguageService, adapter: DateAdapter<any>) {
		language.setLocaleOnAdapter(adapter);
	}
}
