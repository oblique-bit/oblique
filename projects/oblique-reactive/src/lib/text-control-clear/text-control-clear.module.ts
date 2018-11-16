import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';

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
	exports: [
		TextControlClearDirective
	]
})
export class TextControlClearModule {
}
