import {InjectionToken} from '@angular/core';
import {ObIconService} from './icon.service';

export function iconFactory(iconService: ObIconService): () => void {
	return () => iconService.registerOnAppInit();
}

export const ObTIconConfig = new InjectionToken<ObIconConfig>('Oblique icon configuration');

export interface ObIconConfig {
	registerObliqueIcons?: boolean;
	additionalIcons?: string[];
	fontClass?: string;
}

export const defaultIconConfig: ObIconConfig = {
	registerObliqueIcons: true,
	fontClass: 'fa'
};
