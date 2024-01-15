import {NgModule} from '@angular/core';

import {obliqueExports, obliqueProviders} from '../utilities';
import {ObTopControlComponent} from './top-control.component';

export {ObScrollingEvents} from './scrolling-events';
export {ObTopControlComponent} from './top-control.component';

@NgModule({
	imports: [ObTopControlComponent],
	providers: obliqueProviders(),
	exports: [ObTopControlComponent, ...obliqueExports]
})
export class ObScrollingModule {}
