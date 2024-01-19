import {NgModule} from '@angular/core';

import {ObMockStickyComponent} from './mock-sticky.component';

export {ObMockStickyComponent} from './mock-sticky.component';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockStickyComponent],
	exports: [ObMockStickyComponent]
})
export class ObMockStickyModule {}
