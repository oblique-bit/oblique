import {NgModule} from '@angular/core';

import {ObColumnLayoutComponent} from './column-layout.component';
import {ObColumnToggleDirective} from './column-toggle.directive';
import {ObColumnPanelDirective} from './column-panel.directive';

export {ObColumnLayoutComponent} from './column-layout.component';
export {ObColumnPanelDirective} from './column-panel.directive';
export {ObColumnToggleDirective} from './column-toggle.directive';
export {ObTColumnState} from './column-layout.model';

@NgModule({
	imports: [ObColumnLayoutComponent, ObColumnPanelDirective, ObColumnToggleDirective],
	exports: [ObColumnLayoutComponent, ObColumnPanelDirective, ObColumnToggleDirective],
})
export class ObColumnLayoutModule {}
