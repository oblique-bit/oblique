import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {MultiselectComponent} from './multiselect.component';
import {MultiselectConfig} from './multiselect.config';
import {MultiselectSearchPipe} from './multiselect-search.pipe';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [CommonModule, FormsModule, TranslateModule],
    exports: [MultiselectComponent, MultiselectSearchPipe],
    declarations: [MultiselectComponent, MultiselectSearchPipe],
})
export class MultiselectModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MultiselectModule,
            providers: [
                MultiselectConfig
            ]
        };
    }
}
