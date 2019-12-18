import {NgModule} from '@angular/core';

import {MockStickyComponent} from './mock-sticky.component';

export {MockStickyComponent} from './mock-sticky.component';

@NgModule({
	declarations: [MockStickyComponent],
	exports: [MockStickyComponent]
})
export class MockStickyModule {
}
