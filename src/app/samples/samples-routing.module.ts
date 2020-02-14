import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UnsavedChangesGuard} from 'oblique';
import {SampleDataResolver} from '../resolvers/sample-data.resolver';
import {ColumnLayoutSampleComponent} from './column-layout/column-layout-sample.component';
import {DatepickerSampleComponent} from './datepicker-sample/datepicker-sample.component';
import {FilterBoxSampleComponent} from './filter-box-sample/filter-box-sample.component';
import {FormControlStateSampleComponent} from './form-control-state-sample/form-control-state-sample.component';
import {MasterLayoutSampleComponent} from './master-layout/master-layout-sample.component';
import {MultiselectSampleComponent} from './multiselect/multiselect-sample.component';
import {NavigableSampleComponent} from './navigable/navigable-sample.component';
import {NavTreeDetailSampleComponent, NavTreeSampleComponent} from './nav-tree/nav-tree-sample.component';
import {NestedFormSampleComponent} from './nested-form/nested-form-sample.component';
import {NotificationSampleComponent} from './notification/notification-sample.component';
import {SchemaValidationSampleComponent} from './schema-validation/schema-validation-sample.component';
import {UnsavedChangesSampleComponent} from './unsaved-changes/unsaved-changes-sample.component';
import {ToggleSampleComponent} from './toggle/toggle-sample.component';
import {NumberFormatSampleComponent} from './number-format/number-format-sample.component';
import {HttpInterceptorSampleComponent} from './http-interceptor/http-interceptor-sample.component';
import {StickySampleComponent} from './sticky/sticky-sample.component';
import {FormComponent} from './form/form.component';
import {ButtonComponent} from './button/button.component';
import {ErrorMessagesSampleComponent} from './error-messages-sample/error-messages-sample.component';
import {UnknownRouteSampleComponent} from './unknown-route/unknown-route-sample.component';
import {PopUpSampleComponent} from './pop-up/pop-up-sample.component';
import {MultiTranslateLoaderSampleComponent} from './multi-tranlsate-loader/multi-translate-loader-sample.component';
import {SelectableSampleComponent} from './selectable/selectable-sample.component';

const samplesRoutes: Routes = [
	{path: 'column-layout', component: ColumnLayoutSampleComponent},
	{path: 'datepicker', component: DatepickerSampleComponent},
	{path: 'error-messages', component: ErrorMessagesSampleComponent},
	{path: 'filter-box', component: FilterBoxSampleComponent},
	{path: 'form-control-state', component: FormControlStateSampleComponent},
	{path: 'http-interceptor', component: HttpInterceptorSampleComponent},
	{path: 'master-layout', component: MasterLayoutSampleComponent},
	{path: 'multi-translate-loader', component: MultiTranslateLoaderSampleComponent},
	{path: 'multiselect', component: MultiselectSampleComponent},
	{
		path: 'nav-tree',
		component: NavTreeSampleComponent,
		resolve: {
			sample: SampleDataResolver
		},
		children: [
			{path: ':section', component: NavTreeDetailSampleComponent},
			{path: ':section/:subsection', component: NavTreeDetailSampleComponent},
			{path: ':section/:subsection/:subsubsection', component: NavTreeDetailSampleComponent}
		]
	},
	{path: 'navigable', component: NavigableSampleComponent, data: {title: 'Navigable Sample'}},
	{path: 'nested-form', component: NestedFormSampleComponent},
	{path: 'notification', component: NotificationSampleComponent},
	{path: 'number-format', component: NumberFormatSampleComponent},
	{path: 'pop-up', component: PopUpSampleComponent},
	{path: 'schema-validation', component: SchemaValidationSampleComponent},
	{path: 'selectable', component: SelectableSampleComponent},
	{path: 'sticky', component: StickySampleComponent},
	{path: 'toggle', component: ToggleSampleComponent},
	{path: 'unknown-route-sample', component: UnknownRouteSampleComponent},
	{path: 'unsaved-changes', component: UnsavedChangesSampleComponent, canDeactivate: [UnsavedChangesGuard]},
	{path: 'form', component: FormComponent},
	{path: 'button', component: ButtonComponent},
];

@NgModule({
	imports: [
		RouterModule.forChild(samplesRoutes)
	],
	exports: [
		RouterModule
	]
})
export class SamplesRoutingModule {
}
