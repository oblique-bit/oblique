import {NgModule} from '@angular/core';
import {ObMockBreadcrumbComponent} from './mock-breadcrumb.component';

export {ObMockBreadcrumbComponent} from './mock-breadcrumb.component';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	declarations: [ObMockBreadcrumbComponent],
	exports: [ObMockBreadcrumbComponent]
})
export class ObMockBreadcrumbModule {}
