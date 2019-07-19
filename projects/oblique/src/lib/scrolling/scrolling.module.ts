import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';

import {TopControlComponent} from './top-control.component';
export {TopControlComponent} from './top-control.component';
export {ScrollingEvents} from './scrolling-events';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule
	],
	declarations: [TopControlComponent],
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
	exports: [TopControlComponent]
})
export class ScrollingModule {
}
