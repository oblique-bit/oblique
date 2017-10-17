import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SampleDataResolver} from '../resolvers/sample-data.resolver';

import {DatepickerSampleComponent} from './datepicker-sample/datepicker-sample.component';
import {FormControlStateSampleComponent} from './form-control-state-sample/form-control-state-sample.component';
import {MasterLayoutSampleComponent} from './master-layout/master-layout-sample.component';
import {MultiselectSampleComponent} from './multiselect/multiselect-sample.component';
import {NavigableSampleComponent} from './navigable/navigable-sample.component';
import {NavTreeSampleComponent, NavTreeDetailSampleComponent} from './nav-tree/nav-tree-sample.component';
import {NotificationSampleComponent} from './notification/notification-sample.component';
import {SchemaValidationSampleComponent} from './schema-validation/schema-validation-sample.component';
import {UnsavedChangesSampleComponent} from './unsaved-changes/unsaved-changes-sample.component';
import {UnsavedChangesGuard} from '../../../lib/ng/unsaved-changes/unsaved-changes.guard';
import {FilterBoxSampleComponent} from './filter-box-sample/filter-box-sample.component';
import {ColumnToggleSampleComponent} from './column-toggle/column-toggle-sample.component';

const samplesRoutes: Routes = [
	{
		path: 'samples',
		children: [
			{path: 'datepicker', component: DatepickerSampleComponent},
			{path: 'filter-box', component: FilterBoxSampleComponent},
			{
				path: 'navigable', component: NavigableSampleComponent, data: {
					title: 'Navigable Sample',
					description: 'Description for the Navigable Sample'
				}
			},
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
			{path: 'notification', component: NotificationSampleComponent},
			{path: 'multiselect', component: MultiselectSampleComponent},
			{
				path: 'master-layout', component: MasterLayoutSampleComponent, data: {
				masterLayout: {
					hasCover: true
				}
			}
			},
			{path: 'validation/form-control-state', component: FormControlStateSampleComponent},
			{path: 'validation/schema-validation', component: SchemaValidationSampleComponent},
			{path: 'validation/unsaved-changes', component: UnsavedChangesSampleComponent, canDeactivate: [UnsavedChangesGuard]},
			{path: 'column-toggle', component: ColumnToggleSampleComponent},
		]
	}
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
