import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {ColumnLayoutComponent} from './column-layout.component';
import {ColumnToggleDirective} from './column-toggle.directive';
import {ColumnPanelDirective} from './column-panel.directive';

export {ColumnLayoutComponent} from './column-layout.component';

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
		ColumnLayoutComponent
	]
})
export class ColumnLayoutModule {
}
