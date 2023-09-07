import {NgModule} from '@angular/core';
import {obliqueProviders} from '../utilities';
import {ObStickyComponent} from './sticky.component';

export {ObStickyComponent} from './sticky.component';

@NgModule({
	imports: [ObStickyComponent],
	exports: [ObStickyComponent],
	providers: obliqueProviders()
})
export class ObStickyModule {}
