import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {CdkScrollableModule} from '@angular/cdk/scrolling';

import {ObColumnLayoutComponent} from './column-layout.component';
import {ObColumnToggleDirective} from './column-toggle.directive';
import {ObColumnPanelDirective} from './column-panel.directive';

import {obliqueProviders} from '../utilities';

export {ObColumnLayoutComponent} from './column-layout.component';
export {ObColumnPanelDirective} from './column-panel.directive';
export {ObColumnToggleDirective} from './column-toggle.directive';

@NgModule({
	imports: [CdkScrollableModule, CommonModule, MatIconModule, TranslateModule],
	declarations: [ObColumnLayoutComponent, ObColumnPanelDirective, ObColumnToggleDirective],
	providers: obliqueProviders(),
	exports: [ObColumnLayoutComponent, ObColumnPanelDirective, ObColumnToggleDirective]
})
export class ObColumnLayoutModule {}
