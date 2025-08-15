import {NgModule} from '@angular/core';
import {ObMockTopControlComponent} from './mock-top-control.component';

export {ObMockTopControlComponent} from './mock-top-control.component';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockTopControlComponent],
	exports: [ObMockTopControlComponent]
})
export class ObMockScrollingModule {}
