import {NgModule} from '@angular/core';
import {ObMockExternalLinkDirective} from './mock-external-link.directive';
export {ObMockExternalLinkDirective} from './mock-external-link.directive';

@NgModule({
	imports: [ObMockExternalLinkDirective],
	exports: [ObMockExternalLinkDirective]
})
export class ObMockExternalLinkModule {}
