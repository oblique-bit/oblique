import {NgModule} from '@angular/core';

import {obliqueProviders} from '../utilities';
import {ObTopControlComponent} from './top-control.component';

export {ObScrollingEvents} from './scrolling-events';
export {ObTopControlComponent} from './top-control.component';

@NgModule({
	imports: [ObTopControlComponent],
	providers: obliqueProviders(),
	exports: [ObTopControlComponent]
})
export class ObScrollingModule {}
