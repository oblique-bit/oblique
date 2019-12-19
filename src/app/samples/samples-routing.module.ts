import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

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
import {UnsavedChangesGuard} from 'oblique';
import {StickySampleComponent} from './sticky/sticky-sample.component';
import {FormComponent} from './form/form.component';
import {ButtonComponent} from './button/button.component';
import {ErrorMessagesSampleComponent} from './error-messages-sample/error-messages-sample.component';
import {UnknownRouteSampleComponent} from './unknown-route/unknown-route-sample.component';
import {PopUpSampleComponent} from './pop-up/pop-up-sample.component';

const samplesRoutes: Routes = [

	{path: 'column-layout', component: ColumnLayoutSampleComponent},
	{path: 'datepicker', component: DatepickerSampleComponent},
	{path: 'filter-box', component: FilterBoxSampleComponent},
	{
		path: 'navigable', component: NavigableSampleComponent, data: {
			title: 'Navigable Sample',
			description: 'Description for the Navigable Sample'
		}
	},
	{path: 'http-interceptor', component: HttpInterceptorSampleComponent},
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
	{path: 'nested-form', component: NestedFormSampleComponent},
	{path: 'notification', component: NotificationSampleComponent},
	{path: 'multiselect', component: MultiselectSampleComponent},
	{
		path: 'master-layout', component: MasterLayoutSampleComponent, data: {
			masterLayout: {
				hasCover: true
			}
		}
	},
	{path: 'sticky', component: StickySampleComponent},
	{path: 'pop-up', component: PopUpSampleComponent},
	{path: 'validation/form-control-state', component: FormControlStateSampleComponent},
	{path: 'validation/schema-validation', component: SchemaValidationSampleComponent},
	{
		path: 'validation/unsaved-changes',
		component: UnsavedChangesSampleComponent,
		canDeactivate: [UnsavedChangesGuard]
	},
	{path: 'error-messages', component: ErrorMessagesSampleComponent},
	{path: 'toggle', component: ToggleSampleComponent},
	{path: 'number-format', component: NumberFormatSampleComponent},
	{path: 'form', component: FormComponent},
	{path: 'button', component: ButtonComponent},
	{path: 'unknown-route-sample', component: UnknownRouteSampleComponent}
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
