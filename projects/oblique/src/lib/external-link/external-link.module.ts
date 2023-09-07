import {NgModule} from '@angular/core';
import {ObExternalLinkDirective} from './external-link.directive';
import {obliqueProviders} from '../utilities';

export {ObExternalLinkDirective} from './external-link.directive';
export {EXTERNAL_LINK, ObEExternalLinkIcon, ObIExternalLink} from './external-link.model';

@NgModule({
	imports: [ObExternalLinkDirective],
	providers: obliqueProviders(),
	exports: [ObExternalLinkDirective]
})
export class ObExternalLinkModule {}
