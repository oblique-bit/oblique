import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {MatButtonModule, MatIconModule, MatMenuModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatRadioModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {SampleDataResolver} from '../resolvers/sample-data.resolver';
import {SamplesRoutingModule} from './samples-routing.module';

import {ColumnLayoutSampleComponent} from './column-layout/column-layout-sample.component';
import {DatepickerSampleComponent} from './datepicker-sample/datepicker-sample.component';
import {FormControlStateSampleComponent} from './form-control-state-sample/form-control-state-sample.component';
import {FilterBoxSampleComponent, PatternFilterPipe} from './filter-box-sample/filter-box-sample.component';
import {MasterLayoutSampleComponent} from './master-layout/master-layout-sample.component';
import {MultiselectSampleComponent} from './multiselect/multiselect-sample.component';
import {NavigableSampleComponent} from './navigable/navigable-sample.component';
import {NavigatorSampleModule} from './navigator-sample/navigator-sample.module';
import {NavigatorSampleRoutingModule} from './navigator-sample/navigator-sample-routing.module';
import {NavTreeDetailSampleComponent, NavTreeSampleComponent} from './nav-tree/nav-tree-sample.component';
import {NotificationSampleComponent} from './notification/notification-sample.component';
import {NumberFormatSampleComponent} from './number-format/number-format-sample.component';
import {SchemaValidationSampleComponent} from './schema-validation/schema-validation-sample.component';
import {ToggleSampleComponent} from './toggle/toggle-sample.component';
import {UnsavedChangesSampleComponent} from './unsaved-changes/unsaved-changes-sample.component';
import {UnsavedChangesSampleModalComponent} from './unsaved-changes/unsaved-changes-sample-modal.component';
import {HttpInterceptorSampleComponent} from './http-interceptor/http-interceptor-sample.component';
import {StickySampleComponent} from './sticky/sticky-sample.component';
import {FormComponent} from './form/form.component';
import {ButtonComponent} from './button/button.component';

import {
	ColumnLayoutModule,
	DatepickerModule,
	ErrorMessagesModule,
	FilterBoxModule,
	FormControlStateModule,
	MultiselectModule,
	NavigableModule,
	NavTreeModule,
	NotificationModule,
	NumberFormatModule,
	SchemaValidationModule,
	SearchBoxModule,
	ToggleModule,
	StickyModule,
	UnsavedChangesModule
} from 'oblique';

@NgModule({
	imports: [
		CommonModule,
		ColumnLayoutModule,
		DatepickerModule,
		FilterBoxModule,
		ErrorMessagesModule,
		FormControlStateModule,
		MultiselectModule,
		NavigableModule,
		NavTreeModule,
		NumberFormatModule,
		NotificationModule,
		SchemaValidationModule,
		SearchBoxModule,
		StickyModule,
		ToggleModule,
		UnsavedChangesModule,

		TranslateModule,
		FormsModule,
		NgbModule,
		RouterModule,
		SamplesRoutingModule,
		NavigatorSampleModule,
		NavigatorSampleRoutingModule,
		ReactiveFormsModule,
		ReactiveFormsModule,
		MatMenuModule,
		MatIconModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatSelectModule,
		MatCheckboxModule,
		MatRadioModule
	],
	declarations: [
		ButtonComponent,
		ColumnLayoutSampleComponent,
		DatepickerSampleComponent,
		FormComponent,
		FormControlStateSampleComponent,
		FilterBoxSampleComponent,
		HttpInterceptorSampleComponent,
		PatternFilterPipe,
		MasterLayoutSampleComponent,
		MultiselectSampleComponent,
		NavigableSampleComponent,
		NavTreeSampleComponent,
		NavTreeDetailSampleComponent,
		NotificationSampleComponent,
		NumberFormatSampleComponent,
		SchemaValidationSampleComponent,
		StickySampleComponent,
		ToggleSampleComponent,
		UnsavedChangesSampleComponent,
		UnsavedChangesSampleModalComponent
	],
	exports: [
		RouterModule
	],
	providers: [
		SampleDataResolver
	],
	entryComponents: [
		UnsavedChangesSampleModalComponent
	]
})
export class SamplesModule {
}
