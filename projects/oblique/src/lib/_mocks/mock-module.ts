import {NgModule} from '@angular/core';
import {ObMockMatElement} from './mock-mat-element';

export {ObMockMatElement} from './mock-mat-element';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockMatElement],
	exports: [ObMockMatElement],
})
export class ObMockModule {}
