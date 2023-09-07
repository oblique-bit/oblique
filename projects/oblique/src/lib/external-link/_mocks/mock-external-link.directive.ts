import {Directive, Input} from '@angular/core';
import {ObEExternalLinkIcon} from '../external-link.model';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'a[href]',
	standalone: true
})
export class ObMockExternalLinkDirective {
	isExternal = false;
	@Input() rel: string;
	@Input() target: string;
	@Input() href: string;
	@Input() icon: ObEExternalLinkIcon;
}
