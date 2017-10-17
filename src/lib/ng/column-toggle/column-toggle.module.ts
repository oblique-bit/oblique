import {NgModule, ModuleWithProviders} from '@angular/core';
import {ColumnToggleDirective} from './column-toggle.directive';
import {ColumnToggleProvidesDirective} from './column-toggle-provides.directive';

@NgModule({
	declarations: [ColumnToggleDirective, ColumnToggleProvidesDirective],
	exports: [ColumnToggleDirective, ColumnToggleProvidesDirective]
})
export class ColumnToggleModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: ColumnToggleModule
		};
	}
}
