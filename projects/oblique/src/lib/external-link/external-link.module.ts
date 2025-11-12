import {NgModule} from '@angular/core';
import {ObExternalLinkDirective} from './external-link.directive';

export {ObExternalLinkDirective} from './external-link.directive';
export {EXTERNAL_LINK, ObEExternalLinkIcon, ObIExternalLink} from './external-link.model';

@NgModule({
	imports: [ObExternalLinkDirective],
	exports: [ObExternalLinkDirective],
})
export class ObExternalLinkModule {}
