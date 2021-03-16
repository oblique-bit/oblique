import {Directive, Input} from '@angular/core';
import {ObEExternalLinkIcon} from '../external-link.model';

@Directive({
	selector: 'a[href]'
})
export class ObMockExternalLinkDirective {
	isExternal = false;
	@Input() rel: string;
	@Input() target: string;
	@Input() href: string;
	@Input() icon: ObEExternalLinkIcon;
}
