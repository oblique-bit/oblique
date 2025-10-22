import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {CdkScrollableModule} from '@angular/cdk/scrolling';

import {ObColumnLayoutComponent} from './column-layout.component';
import {ObColumnToggleDirective} from './column-toggle.directive';
import {ObColumnPanelDirective} from './column-panel.directive';

export {ObColumnLayoutComponent} from './column-layout.component';
export {ObColumnPanelDirective} from './column-panel.directive';
export {ObColumnToggleDirective} from './column-toggle.directive';

@NgModule({
	declarations: [ObColumnLayoutComponent, ObColumnPanelDirective, ObColumnToggleDirective],
	imports: [CdkScrollableModule, CommonModule, MatIconModule, TranslateModule],
	exports: [ObColumnLayoutComponent, ObColumnPanelDirective, ObColumnToggleDirective]
})
export class ObColumnLayoutModule {}
