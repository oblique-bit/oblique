import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToggleDirective} from './toggle.directive';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [ToggleDirective],
	exports: [ToggleDirective]
})
export class ToggleModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: ToggleModule
		};
	}
}
