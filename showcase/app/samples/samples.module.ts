import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NavigableSampleComponent} from './navigable/navigable-sample.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MultiselectDropdownModule} from 'ngx-multiselect-dropdown';

import {ObliqueModule} from '../../../src/index';
import {SchemaValidationComponent} from './schema-validation/schema-validation.component';
import {DatepickerComponent} from './datepicker/datepicker.component';
import {SamplesRoutingModule} from './samples-routing.module';
import {MultiselectSampleComponent} from './multiselect/multiselect-sample.component';

@NgModule({
    imports: [
        CommonModule,
        ObliqueModule,
        TranslateModule,
        FormsModule,
        SamplesRoutingModule,
        MultiselectDropdownModule,
        NgbModule
    ],
    declarations: [NavigableSampleComponent, SchemaValidationComponent, DatepickerComponent, MultiselectSampleComponent]
})
export class SamplesModule {
}
