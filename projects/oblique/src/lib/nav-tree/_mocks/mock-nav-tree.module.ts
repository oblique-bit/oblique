import {NgModule} from '@angular/core';
import {ObMockNavTreeComponent} from './mock-nav-tree.component';

export {ObMockNavTreeComponent} from './mock-nav-tree.component';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockNavTreeComponent],
	exports: [ObMockNavTreeComponent]
})
export class ObMockNavTreeModule {}
