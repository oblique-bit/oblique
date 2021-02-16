import {InjectionToken} from '@angular/core';
import {ObIconService} from './icon.service';

export function iconFactory(iconService: ObIconService): () => void {
	return () => iconService.registerOnAppInit();
}

export const ObTIconConfig = new InjectionToken<ObIconsConfig>('Oblique icon configuration');

export interface ObIconsConfig {
	registerObliqueIcons?: boolean;
	additionalIcons?: string[];
	fontClass?: string;
}

export const defaultIconConfig: ObIconsConfig = {
	registerObliqueIcons: true,
	fontClass: 'fa'
};
