import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NumberFormatDirective} from './number-format.directive';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [NumberFormatDirective],
	exports: [NumberFormatDirective]
})
export class NumberFormatModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: NumberFormatModule
		};
	}
}
