import {InjectionToken} from '@angular/core';
import {ObIconService} from './icon.service';

export function iconFactory(iconService: ObIconService): () => void {
	return () => iconService.registerOnAppInit();
}

export const ObTIconConfig = new InjectionToken<ObIconConfig>('Oblique icon configuration');
export const ObUseObliqueIcons = new InjectionToken<boolean>('Does Oblique use its own icons by default');

export interface ObIconConfig {
	registerObliqueIcons?: boolean;
	additionalIcons?: string[];
	fontClass?: string;
}

export const defaultIconConfig: ObIconConfig = {
	registerObliqueIcons: true,
	fontClass: 'fa'
};
