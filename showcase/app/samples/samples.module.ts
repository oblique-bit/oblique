import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NavigableSampleComponent} from './navigable/navigable-sample.component';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {ObliqueModule} from '../../../src/index';
import {SchemaValidationComponent} from './schema-validation/schema-validation-sample.component';
import {DatepickerComponent} from './datepicker/datepicker.component';
import {SamplesRoutingModule} from './samples-routing.module';
import {MultiselectSampleComponent} from './multiselect/multiselect-sample.component';
import {NavigatorSampleModule} from './navigator-sample/navigator-sample.module';
import {NavigatorSampleRoutingModule} from './navigator-sample/navigator-sample-routing.module';
import {NavTreeSampleComponent, NavTreeDetailSampleComponent} from './nav-tree/nav-tree-sample.component';
import {SampleDataResolver} from '../resolvers/sample-data.resolver';
import { FormControlStateSampleComponent } from './form-control-state-sample/form-control-state-sample.component';

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
		DatepickerComponent,
		MultiselectSampleComponent,
		NavigableSampleComponent,
		NavTreeSampleComponent,
		NavTreeDetailSampleComponent,
		SchemaValidationComponent,
		FormControlStateSampleComponent
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
