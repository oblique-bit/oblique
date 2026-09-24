import {NgModule} from '@angular/core';

import {ObMockCollapseComponent} from './mock-collapse.component';
export {ObMockCollapseComponent} from './mock-collapse.component';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@NgModule({
	imports: [ObMockCollapseComponent],
	exports: [ObMockCollapseComponent],
})
export class ObMockCollapseModule {}
