import {NgModule} from '@angular/core';

import {ObMockStickyComponent} from './mock-sticky.component';

export {ObMockStickyComponent} from './mock-sticky.component';

@NgModule({
	declarations: [ObMockStickyComponent],
	exports: [ObMockStickyComponent]
})
export class ObMockStickyModule {}
