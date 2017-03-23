import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NavigableComponent} from './navigable/navigable.component';
import {TranslateModule} from 'ng2-translate';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {ObliqueModule} from '../../../src/index';
import {SchemaValidationComponent} from './schema-validation/schema-validation.component';
import {DatepickerComponent} from './datepicker/datepicker.component';
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
    declarations: [NavigableComponent, SchemaValidationComponent, DatepickerComponent]
})
export class SamplesModule {
}
