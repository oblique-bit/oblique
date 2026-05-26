import {NgModule} from '@angular/core';
import {ObMockExternalLinkDirective} from './mock-external-link.directive';
export {ObMockExternalLinkDirective} from './mock-external-link.directive';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@NgModule({
	imports: [ObMockExternalLinkDirective],
	exports: [ObMockExternalLinkDirective],
})
export class ObMockExternalLinkModule {}
