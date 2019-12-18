import {NgModule} from '@angular/core';
import {MockUnknownRouteComponent} from './mock-unknown-route.component';

export {MockUnknownRouteComponent} from './mock-unknown-route.component';

@NgModule({
	declarations: [MockUnknownRouteComponent],
	exports: [MockUnknownRouteComponent]
})
export class MockUnknownRouteModule {
}
