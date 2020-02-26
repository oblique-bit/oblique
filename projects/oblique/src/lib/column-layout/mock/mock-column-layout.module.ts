import {NgModule} from '@angular/core';
import {ObMockColumnLayoutComponent} from './mock-column-layout.component';
import {ObMockColumnPanelDirective} from './mock-column-panel.directive';
import {ObMockColumnToggleDirective} from './mock-column-toggle.directive';

export {ObMockColumnLayoutComponent} from './mock-column-layout.component';

@NgModule({
	declarations: [ObMockColumnLayoutComponent, ObMockColumnPanelDirective, ObMockColumnToggleDirective],
	exports: [ObMockColumnLayoutComponent]
})
export class ObMockColumnLayoutModule {
}
