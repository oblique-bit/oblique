import {NgModule} from '@angular/core';

import {MockCollapseComponent} from './mock-collapse.component';
export {MockCollapseComponent} from './mock-collapse.component';

@NgModule({
	declarations: [MockCollapseComponent],
	exports: [MockCollapseComponent]
})
export class MockCollapseModule {
}
