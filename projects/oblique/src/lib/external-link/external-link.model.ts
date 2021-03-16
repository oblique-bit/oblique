import {InjectionToken} from '@angular/core';

export type ObEExternalLinkIcon = 'left' | 'right' | 'none';
export interface ObIExternalLink {
	rel: string;
	target: '_blank' | '_self' | '_parent' | '_top' | string;
	icon: ObEExternalLinkIcon;
}
export const EXTERNAL_LINK = new InjectionToken<ObIExternalLink>('EXTERNAL_LINK');
