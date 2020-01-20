import {NgModule} from '@angular/core';
import {MockColumnLayoutComponent} from './mock-column-layout.component';
import {MockColumnPanelDirective} from './mock-column-panel.directive';
import {MockColumnToggleDirective} from './mock-column-toggle.directive';

export {MockColumnLayoutComponent} from './mock-column-layout.component';

@NgModule({
	declarations: [MockColumnLayoutComponent, MockColumnPanelDirective, MockColumnToggleDirective],
	exports: [MockColumnLayoutComponent]
})
export class MockColumnLayoutModule {
}
