import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {FormControlStateDirective} from './form-control-state.directive';

export {FormControlStateDirective} from './form-control-state.directive';

@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [FormControlStateDirective],
	exports: [FormControlStateDirective]
})
export class FormControlStateModule {
}
