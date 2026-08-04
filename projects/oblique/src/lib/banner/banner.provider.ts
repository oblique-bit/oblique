import {InjectionToken, Provider} from '@angular/core';
import {ObTBanner} from './banner.model';

/**
 *  @deprecated since Oblique 16.0.0. To be removed in Oblique 17.0.0. Use provideObliqueConfiguration instead.
 */
export const OB_BANNER = new InjectionToken<ObTBanner>('Banner');

export function obProvideBanner(config: ObTBanner): Provider[] {
	return [{provide: OB_BANNER, useValue: config}];
}

export const obDefaultBannerConfiguration: ObTBanner = undefined;
