import {Directive, input} from '@angular/core';
import {ObEExternalLinkIcon} from '../external-link.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'a[href]',
})
export class ObMockExternalLinkDirective {
	isExternal = false;
	readonly rel = input<string>();
	readonly target = input<string>();
	readonly href = input<string>();
	readonly icon = input<ObEExternalLinkIcon>();
}
