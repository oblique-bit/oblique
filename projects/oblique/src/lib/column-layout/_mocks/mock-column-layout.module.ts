import {NgModule} from '@angular/core';
import {ObMockColumnLayoutComponent} from './mock-column-layout.component';
import {ObMockColumnPanelDirective} from './mock-column-panel.directive';
import {ObMockColumnToggleDirective} from './mock-column-toggle.directive';

export {ObMockColumnLayoutComponent} from './mock-column-layout.component';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	declarations: [ObMockColumnLayoutComponent, ObMockColumnPanelDirective, ObMockColumnToggleDirective],
	exports: [ObMockColumnLayoutComponent]
})
export class ObMockColumnLayoutModule {}
