import {NgModule} from '@angular/core';

import {ObScrollingEvents} from '../scrolling.module';
import {ObMockTopControlComponent} from './mock-top-control.component';
import {ObMockScrollingEvents} from './mock-scrolling-events.service';

export {ObMockTopControlComponent} from './mock-top-control.component';
export {ObMockScrollingEvents} from './mock-scrolling-events.service';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockTopControlComponent],
	exports: [ObMockTopControlComponent],
	providers: [{provide: ObScrollingEvents, useClass: ObMockScrollingEvents}]
})
export class ObMockScrollingModule {}
