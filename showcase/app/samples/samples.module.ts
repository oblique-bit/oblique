import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NavigableSampleComponent} from './navigable/navigable-sample.component';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {ObliqueModule} from '../../../src/index';
import {DatepickerSampleComponent} from './datepicker-sample/datepicker-sample.component';
import {FormControlStateSampleComponent} from './form-control-state-sample/form-control-state-sample.component';
import {LayoutManagerSampleComponent} from './layout-manager/layout-manager-sample.component';
import {UnsavedChangesComponent} from './unsaved-changes/unsaved-changes-sample.component';
import {MultiselectSampleComponent} from './multiselect/multiselect-sample.component';
import {NavigatorSampleModule} from './navigator-sample/navigator-sample.module';
import {NavigatorSampleRoutingModule} from './navigator-sample/navigator-sample-routing.module';
import {NavTreeSampleComponent, NavTreeDetailSampleComponent} from './nav-tree/nav-tree-sample.component';
import {SampleDataResolver} from '../resolvers/sample-data.resolver';
import {SamplesRoutingModule} from './samples-routing.module';
import {SchemaValidationComponent} from './schema-validation/schema-validation-sample.component';

@NgModule({
	imports: [
		CommonModule,
		ObliqueModule,
		TranslateModule,
		FormsModule,
		NgbModule,
		RouterModule,
		SamplesRoutingModule,
		NavigatorSampleModule,
		NavigatorSampleRoutingModule
	],
	declarations: [
		DatepickerSampleComponent,
		MultiselectSampleComponent,
		NavigableSampleComponent,
		NavTreeSampleComponent,
		NavTreeDetailSampleComponent,
		SchemaValidationComponent,
		FormControlStateSampleComponent,
		LayoutManagerSampleComponent,
		UnsavedChangesComponent
	],
	exports: [
		RouterModule
	],
	providers: [
		SampleDataResolver
	],
})
export class SamplesModule {
}
