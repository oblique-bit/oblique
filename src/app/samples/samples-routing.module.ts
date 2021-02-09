import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ObUnsavedChangesGuard} from 'oblique';
import {SampleDataResolver} from '../resolvers/sample-data.resolver';
import {ObCollapseSampleComponent} from './collapse/collapse-sample.component';
import {ObColumnLayoutSampleComponent} from './column-layout/column-layout-sample.component';
import {ObDatepickerSampleComponent} from './datepicker-sample/datepicker-sample.component';
import {ObFormControlStateSampleComponent} from './form-control-state-sample/form-control-state-sample.component';
import {ObInputClearSampleComponent} from './input-clear/input-clear.component';
import {ObMasterLayoutSampleComponent} from './master-layout/master-layout-sample.component';
import {ObMultiselectSampleComponent} from './multiselect/multiselect-sample.component';
import {ObNavTreeDetailSampleComponent, ObNavTreeSampleComponent} from './nav-tree/nav-tree-sample.component';
import {ObNestedFormSampleComponent} from './nested-form/nested-form-sample.component';
import {ObNotificationSampleComponent} from './notification/notification-sample.component';
import {ObSchemaValidationSampleComponent} from './schema-validation/schema-validation-sample.component';
import {ObUnsavedChangesSampleComponent} from './unsaved-changes/unsaved-changes-sample.component';
import {ObNumberFormatSampleComponent} from './number-format/number-format-sample.component';
import {ObHttpInterceptorSampleComponent} from './http-interceptor/http-interceptor-sample.component';
import {ObStickySampleComponent} from './sticky/sticky-sample.component';
import {ObFormSampleComponent} from './form/form.component';
import {ObButtonSampleComponent} from './button/button.component';
import {ObErrorMessagesSampleComponent} from './error-messages-sample/error-messages-sample.component';
import {ObUnknownRouteSampleComponent} from './unknown-route/unknown-route-sample.component';
import {ObPopUpSampleComponent} from './pop-up/pop-up-sample.component';
import {ObMultiTranslateLoaderSampleComponent} from './multi-translate-loader/multi-translate-loader-sample.component';
import {ObSelectableSampleComponent} from './selectable/selectable-sample.component';
import {ObSpinnerSampleComponent} from './spinner-sample/spinner-sample.component';
import {ObLanguageSampleComponent} from './language/language-sample.component';
import {ObSearchBoxSampleComponent} from './search-box/search-box.component';

const samplesRoutes: Routes = [
	{path: 'collapse', component: ObCollapseSampleComponent},
	{path: 'column-layout', component: ObColumnLayoutSampleComponent},
	{path: 'datepicker', component: ObDatepickerSampleComponent},
	{path: 'error-messages', component: ObErrorMessagesSampleComponent},
	{path: 'form-control-state', component: ObFormControlStateSampleComponent},
	{path: 'http-interceptor', component: ObHttpInterceptorSampleComponent},
	{path: 'input-clear', component: ObInputClearSampleComponent},
	{path: 'language', component: ObLanguageSampleComponent},
	{path: 'master-layout', component: ObMasterLayoutSampleComponent},
	{path: 'multi-translate-loader', component: ObMultiTranslateLoaderSampleComponent},
	{path: 'multiselect', component: ObMultiselectSampleComponent},
	{
		path: 'nav-tree',
		component: ObNavTreeSampleComponent,
		resolve: {
			sample: SampleDataResolver
		},
		children: [
			{path: ':section', component: ObNavTreeDetailSampleComponent},
			{path: ':section/:subsection', component: ObNavTreeDetailSampleComponent},
			{path: ':section/:subsection/:subsubsection', component: ObNavTreeDetailSampleComponent}
		]
	},
	{path: 'nested-form', component: ObNestedFormSampleComponent},
	{path: 'notification', component: ObNotificationSampleComponent},
	{path: 'number-format', component: ObNumberFormatSampleComponent},
	{path: 'pop-up', component: ObPopUpSampleComponent},
	{path: 'schema-validation', component: ObSchemaValidationSampleComponent},
	{path: 'search-box', component: ObSearchBoxSampleComponent},
	{path: 'selectable', component: ObSelectableSampleComponent},
	{path: 'sticky', component: ObStickySampleComponent},
	{path: 'spinner', component: ObSpinnerSampleComponent},
	{path: 'unknown-route-sample', component: ObUnknownRouteSampleComponent},
	{path: 'unsaved-changes', component: ObUnsavedChangesSampleComponent, canDeactivate: [ObUnsavedChangesGuard]},
	{path: 'form', component: ObFormSampleComponent},
	{path: 'button', component: ObButtonSampleComponent}
];

@NgModule({
	imports: [RouterModule.forChild(samplesRoutes)],
	exports: [RouterModule]
})
export class SamplesRoutingModule {}
