import {Directive, Input} from '@angular/core';
import {ObEExternalLinkIcon} from '../external-link.model';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
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
