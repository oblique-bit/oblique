import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';

import {TextControlClearModule} from '../text-control-clear/text-control-clear.module';
import {FilterBoxComponent} from './filter-box.component';

export {FilterBoxComponent} from './filter-box.component';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		FormsModule,
		TextControlClearModule
	],
	declarations: [FilterBoxComponent],
	exports: [FilterBoxComponent]
})
export class FilterBoxModule {
}
