import {InjectionToken, Provider} from '@angular/core';
import {ObTBanner} from './banner.model';

export const OB_BANNER = new InjectionToken<ObTBanner>('Banner');

export function obProvideBanner(config: ObTBanner): Provider[] {
	return [{provide: OB_BANNER, useValue: config}];
}

export const obDefaultBannerConfiguration: ObTBanner = undefined;
