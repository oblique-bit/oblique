import {NgModule} from '@angular/core';
import {ObMockExternalLinkDirective} from './mock-external-link.directive';
export {ObMockExternalLinkDirective} from './mock-external-link.directive';

@NgModule({
	declarations: [ObMockExternalLinkDirective],
	exports: [ObMockExternalLinkDirective]
})
export class ObMockExternalLinkModule {}
