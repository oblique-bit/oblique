import {NgModule} from '@angular/core';
import {ObStickyComponent} from './sticky.component';

export {ObStickyComponent} from './sticky.component';

/**
 * @deprecated since version 11.0.0. It will be removed with Oblique 12. CSS flexbox and / or position: sticky should be used instead.
 */
@NgModule({
	imports: [ObStickyComponent],
	exports: [ObStickyComponent]
})
export class ObStickyModule {}
