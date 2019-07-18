import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';

import {ScrollDetectionDirective} from './scroll-detection.directive';
import {TopControlComponent} from './top-control.component';

export {ScrollDetectionDirective} from './scroll-detection.directive';
export {TopControlComponent} from './top-control.component';
export {ScrollingEvents} from './scrolling-events';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule
	],
	declarations: [
		ScrollDetectionDirective,
		TopControlComponent],
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
	exports: [
		ScrollDetectionDirective,
		TopControlComponent
	]
})
export class ScrollingModule {
}
