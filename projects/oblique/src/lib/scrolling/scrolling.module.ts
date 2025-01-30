import {NgModule} from '@angular/core';

import {ObTopControlComponent} from './top-control.component';

export {ObScrollingEvents} from './scrolling-events';
export {ObTopControlComponent} from './top-control.component';

@NgModule({
	imports: [ObTopControlComponent],
	exports: [ObTopControlComponent]
})
export class ObScrollingModule {}
