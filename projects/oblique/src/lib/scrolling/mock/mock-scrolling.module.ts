import {NgModule} from '@angular/core';

import {ScrollingEvents} from '../scrolling.module';
import {MockTopControlComponent} from './mock-top-control.component';
import {MockScrollingEvents} from './mock-scrolling-events.service';

export {MockTopControlComponent} from './mock-top-control.component';
export {MockScrollingEvents} from './mock-scrolling-events.service';

@NgModule({
	declarations: [MockTopControlComponent],
	exports: [MockTopControlComponent],
	providers: [
		{provide: ScrollingEvents, useClass: MockScrollingEvents}
	]
})
export class MockScrollingModule {
}
