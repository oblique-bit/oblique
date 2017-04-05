import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DatepickerComponent} from './datepicker/datepicker.component';
import {NavigableSampleComponent} from './navigable/navigable-sample.component';
import {SchemaValidationComponent} from './schema-validation/schema-validation.component';
import {UnsavedChangesComponent} from './unsaved-changes/unsaved-changes-sample.component';

const samplesRoutes: Routes = [
	{path: 'datepicker', component: DatepickerComponent},
	{path: 'navigable', component: NavigableSampleComponent},
	{path: 'schema-validation', component: SchemaValidationComponent},
	{path: 'unsaved-changes', component: UnsavedChangesComponent}
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
