import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SampleDataResolver} from '../resolvers/sample-data.resolver';

import {DatepickerSampleComponent} from './datepicker-sample/datepicker-sample.component';
import {FormControlStateSampleComponent} from './form-control-state-sample/form-control-state-sample.component';
import {LayoutManagerSampleComponent} from './layout-manager/layout-manager-sample.component';
import {MultiselectSampleComponent} from './multiselect/multiselect-sample.component';
import {NavigableSampleComponent} from './navigable/navigable-sample.component';
import {NavTreeSampleComponent, NavTreeDetailSampleComponent} from './nav-tree/nav-tree-sample.component';
import {NotificationSampleComponent} from './notification/notification-sample.component';
import {SchemaValidationComponent} from './schema-validation/schema-validation-sample.component';
import {UnsavedChangesSampleComponent} from './unsaved-changes/unsaved-changes-sample.component';
import {UnsavedChangesGuard} from '../../../lib/ng/unsaved-changes/unsaved-changes.guard';

const samplesRoutes: Routes = [
	{path: 'datepicker', component: DatepickerSampleComponent},
	{path: 'form-control-state', component: FormControlStateSampleComponent},
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
			{ path: ':section', component: NavTreeDetailSampleComponent},
			{ path: ':section/:subsection', component: NavTreeDetailSampleComponent},
			{ path: ':section/:subsection/:subsubsection', component: NavTreeDetailSampleComponent}
		]
	},
	{path: 'notification', component: NotificationSampleComponent},
	{path: 'multiselect', component: MultiselectSampleComponent},
	{path: 'schema-validation', component: SchemaValidationComponent},
	{
		path: 'layout-manager', component: LayoutManagerSampleComponent, data: {
		layoutManager: {
			hasCover: true
		}
	}
	},
	{path: 'unsaved-changes', component: UnsavedChangesSampleComponent, canDeactivate: [UnsavedChangesGuard]}
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
