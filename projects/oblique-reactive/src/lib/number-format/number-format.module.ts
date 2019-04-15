import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';

import {NumberFormatDirective} from './number-format.directive';

export {NumberFormatDirective} from './number-format.directive';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [NumberFormatDirective],
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
	exports: [NumberFormatDirective]
})
export class NumberFormatModule {
}
