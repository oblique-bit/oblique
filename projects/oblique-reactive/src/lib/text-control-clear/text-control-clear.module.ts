import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';

import {TextControlClearDirective} from './text-control-clear.directive';

export {TextControlClearDirective} from './text-control-clear.directive';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		FormsModule
	],
	declarations: [
		TextControlClearDirective
	],
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
	exports: [
		TextControlClearDirective
	]
})
export class TextControlClearModule {
}
