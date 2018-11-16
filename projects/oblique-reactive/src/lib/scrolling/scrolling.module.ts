import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {ScrollDetectionDirective} from './scroll-detection.directive';
import {TopControlComponent} from './top-control.component';
import {ScrollingConfig} from './scrolling.config';

export {ScrollDetectionDirective} from './scroll-detection.directive';
export {TopControlComponent} from './top-control.component';
export {ScrollingConfig} from './scrolling.config';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule
	],
	declarations: [
		ScrollDetectionDirective,
		TopControlComponent],
	exports: [
		ScrollDetectionDirective,
		TopControlComponent
	]
})
export class ScrollingModule {
}
