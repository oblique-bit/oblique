import {NgModule, ModuleWithProviders} from '@angular/core';
import {ColumnToggleDirective} from './column-toggle.directive';
import {ColumnDirective} from './column.directive';

@NgModule({
	declarations: [ColumnToggleDirective, ColumnDirective],
	exports: [ColumnToggleDirective, ColumnDirective]
})
export class ColumnModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: ColumnModule
		};
	}
}
