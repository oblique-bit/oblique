import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NavigableComponent} from './navigable/navigable.component';
import {TranslateModule} from 'ng2-translate';
import {ObliqueModule} from '../../../src/index';
import { SchemaValidationComponent } from './schema-validation/schema-validation.component';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        ObliqueModule,
        TranslateModule,
        FormsModule,
        RouterModule
    ],
    declarations: [NavigableComponent, SchemaValidationComponent]
})
export class SamplesModule {
}
