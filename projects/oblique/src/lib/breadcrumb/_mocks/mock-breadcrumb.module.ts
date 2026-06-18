import {NgModule} from '@angular/core';
import {ObMockBreadcrumbComponent} from './mock-breadcrumb.component';

export {ObMockBreadcrumbComponent} from './mock-breadcrumb.component';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@NgModule({
	imports: [ObMockBreadcrumbComponent],
	exports: [ObMockBreadcrumbComponent],
})
export class ObMockBreadcrumbModule {}
