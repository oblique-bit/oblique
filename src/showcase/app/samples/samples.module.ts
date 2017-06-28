import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NavigableSampleComponent} from './navigable/navigable-sample.component';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {ObliqueModule} from '../../../lib/ng/index';
import {SampleDataResolver} from '../resolvers/sample-data.resolver';
import {SamplesRoutingModule} from './samples-routing.module';

import {DatepickerSampleComponent} from './datepicker-sample/datepicker-sample.component';
import {FormControlStateSampleComponent} from './form-control-state-sample/form-control-state-sample.component';
import {LayoutManagerSampleComponent} from './layout-manager/layout-manager-sample.component';
import {MultiselectSampleComponent} from './multiselect/multiselect-sample.component';
import {NavigatorSampleModule} from './navigator-sample/navigator-sample.module';
import {NavigatorSampleRoutingModule} from './navigator-sample/navigator-sample-routing.module';
import {NavTreeSampleComponent, NavTreeDetailSampleComponent} from './nav-tree/nav-tree-sample.component';
import {NotificationSampleComponent} from './notification/notification-sample.component';
import {SchemaValidationComponent} from './schema-validation/schema-validation-sample.component';
import {UnsavedChangesSampleComponent} from './unsaved-changes/unsaved-changes-sample.component';
import {UnsavedChangesSampleModalComponent} from './unsaved-changes/unsaved-changes-sample-modal.component';
import {FilterBoxSampleComponent, PatternFilterPipe} from './filter-box-sample/filter-box-sample.component';

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
		FormControlStateSampleComponent,
		FilterBoxSampleComponent,
		PatternFilterPipe,
		LayoutManagerSampleComponent,
		MultiselectSampleComponent,
		NavigableSampleComponent,
		NavTreeSampleComponent,
		NavTreeDetailSampleComponent,
		NotificationSampleComponent,
		SchemaValidationComponent,
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
