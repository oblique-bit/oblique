import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScrollDetectionDirective} from './scroll-detection.directive';
import {HeaderTransitionDirective} from './header-transition.directive';
import {TopControlComponent} from './top-control.component';
import {TranslateModule} from '@ngx-translate/core';
import {ScrollingConfig} from './scrolling-config';


@NgModule({
	imports: [
		CommonModule,
		TranslateModule
	],
	declarations: [ScrollDetectionDirective, HeaderTransitionDirective, TopControlComponent],
	exports: [ScrollDetectionDirective, HeaderTransitionDirective, TopControlComponent]
})
export class ScrollingModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: ScrollingModule,
			providers: [
				ScrollingConfig
			]
		};
	}
}
