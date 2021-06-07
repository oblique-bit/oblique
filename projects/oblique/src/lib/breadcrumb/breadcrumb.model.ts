import {InjectionToken} from '@angular/core';

export interface ObIBreadcrumb {
	label: string;
	url: string;
}

export const ObTBreadcrumbConfig = new InjectionToken<ObBreadcrumbConfig>('Oblique breadcrumb configuration');

export interface ObBreadcrumbConfig {
	maxWidth?: string;
	parameterSeparator?: string;
	beautifyUrls?: boolean;
}

export const defaultBreadcrumbConfig: ObBreadcrumbConfig = {
	maxWidth: '32ch',
	parameterSeparator: ' – ',
	beautifyUrls: true
};
