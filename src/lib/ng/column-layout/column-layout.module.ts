import {NgModule, ModuleWithProviders} from '@angular/core';
import {ColumnLayoutComponent} from './column-layout.component';
import {ColumnToggleDirective} from './column-toggle.directive';
import {ColumnPanelDirective} from "./column-panel.directive";
import {TranslateModule} from "@ngx-translate/core";
import {CommonModule} from "@angular/common";

@NgModule({
	imports: [
		CommonModule,
		TranslateModule
	],
	declarations: [
		ColumnLayoutComponent,
		ColumnPanelDirective,
		ColumnToggleDirective
	],
	exports: [
		ColumnLayoutComponent,
		ColumnPanelDirective,
		ColumnToggleDirective
	]
})
export class ColumnLayoutModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: ColumnLayoutModule
		};
	}
}
