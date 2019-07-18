import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule, MatFormFieldModule, MatInputModule, MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';

import {TextControlClearModule} from '../text-control-clear/text-control-clear.module';
import {FilterBoxComponent} from './filter-box.component';

export {FilterBoxComponent} from './filter-box.component';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		FormsModule,
		TextControlClearModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule
	],
	declarations: [FilterBoxComponent],
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
	exports: [FilterBoxComponent]
})
export class FilterBoxModule {
}
