import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';

import {SpinnerComponent} from './spinner.component';
import {SpinnerService} from './spinner.service';

export {SpinnerComponent} from './spinner.component';
export {SpinnerService} from './spinner.service';
export {SpinnerEvent} from './spinner-event';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [SpinnerComponent],
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
	exports: [SpinnerComponent]
})
export class SpinnerModule {
}
