import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DatepickerComponent} from './datepicker/datepicker.component';
import {NavigableSampleComponent} from './navigable/navigable-sample.component';
import {NavTreeSampleComponent, NavTreeDetailSampleComponent} from './nav-tree/nav-tree-sample.component';
import {LayoutManagerSampleComponent} from './layout-manager/layout-manager-sample.component';
import {MultiselectSampleComponent} from './multiselect/multiselect-sample.component';
import {SampleDataResolver} from '../resolvers/sample-data.resolver';
import {SchemaValidationComponent} from './schema-validation/schema-validation.component';

const samplesRoutes: Routes = [
	{path: 'datepicker', component: DatepickerComponent},
	{path: 'navigable', component: NavigableSampleComponent, data: {
		title: 'Navigable Sample',
		description: 'Description for the Navigable Sample'
	}},
	{
		path: 'nav-tree',
		component: NavTreeSampleComponent,
		resolve: {
			sample: SampleDataResolver
		},
		children: [{
		path: ':id',
			component: NavTreeDetailSampleComponent,
		}]},
	{path: 'multiselect', component: MultiselectSampleComponent},
	{path: 'schema-validation', component: SchemaValidationComponent},
	{path: 'layout-manager', component: LayoutManagerSampleComponent, data: {
		uiLayout: {
			application: 'has-cover'
		}
	}}
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
