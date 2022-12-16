import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObExternalLinkDirective} from './external-link.directive';
import {obliqueProviders} from '../utilities';

export {ObExternalLinkDirective} from './external-link.directive';
export {EXTERNAL_LINK, ObEExternalLinkIcon, ObIExternalLink} from './external-link.model';

@NgModule({
	declarations: [ObExternalLinkDirective],
	imports: [CommonModule],
	providers: obliqueProviders(),
	exports: [ObExternalLinkDirective]
})
export class ObExternalLinkModule {}
