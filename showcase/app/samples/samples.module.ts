import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NavigableSampleComponent} from './navigable/navigable-sample.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {ObliqueModule} from '../../../src/index';
import {SchemaValidationComponent} from './schema-validation/schema-validation.component';
import {DatepickerComponent} from './datepicker/datepicker.component';
import {UnsavedChangesComponent} from './unsaved-changes/unsaved-changes-sample.component';
import {SamplesRoutingModule} from './samples-routing.module';

@NgModule({
	imports: [
		CommonModule,
		ObliqueModule,
		TranslateModule,
		FormsModule,
		SamplesRoutingModule,
		NgbModule
	],
	declarations: [NavigableSampleComponent, SchemaValidationComponent, DatepickerComponent, UnsavedChangesComponent]
})
export class SamplesModule {
}
