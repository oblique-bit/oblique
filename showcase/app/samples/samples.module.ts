import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NavigableSampleComponent} from './navigable/navigable.sample.component';
import {TranslateModule} from 'ng2-translate';
import {ObliqueModule} from '../../../src/index';
import {SchemaValidationComponent} from './schema-validation/schema-validation.component';
import {RouterModule} from '@angular/router';
import { BootstrapTestComponent } from './bootstrap-test/bootstrap-test.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
    imports: [
        CommonModule,
        ObliqueModule,
        TranslateModule,
        FormsModule,
        RouterModule,
        NgbModule
    ],
    declarations: [NavigableSampleComponent, SchemaValidationComponent, BootstrapTestComponent]
})
export class SamplesModule {
}
