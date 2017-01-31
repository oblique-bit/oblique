import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigableComponent} from './navigable/navigable.component';
import {TranslateModule} from 'ng2-translate';
import {ObliqueModule} from "../../../src/index";

@NgModule({
    imports: [
        CommonModule,
        ObliqueModule,
        TranslateModule
    ],
    declarations: [NavigableComponent]
})
export class SamplesModule {
}
