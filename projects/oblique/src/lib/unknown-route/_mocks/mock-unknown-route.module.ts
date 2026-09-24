import {NgModule} from '@angular/core';
import {ObMockUnknownRouteComponent} from './mock-unknown-route.component';

export {ObMockUnknownRouteComponent} from './mock-unknown-route.component';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@NgModule({
	imports: [ObMockUnknownRouteComponent],
	exports: [ObMockUnknownRouteComponent],
})
export class ObMockUnknownRouteModule {}
