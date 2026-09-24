import {DOCUMENT, InjectionToken, Provider} from '@angular/core';
import {ObWindow} from './window.provider.model';

export const WINDOW = new InjectionToken<Window>('Window');

export function obProvideWindow(): Provider[] {
	return [{provide: WINDOW, useFactory: windowProvider, deps: [DOCUMENT]}];
}

const mockWindow: ObWindow = {
	confirm: () => false,
	history: {length: 0},
	innerHeight: 700,
	innerWidth: 700,
	localStorage: {
		getItem: () => '',
		setItem: noop,
		removeItem: noop,
	},
	location: {href: '', host: '', origin: ''},
	matchMedia: () => ({matches: false}),
	open: () => null,
	pageYOffset: 42,
	setInterval: () => 1,
	setTimeout: () => 1,
} as const;

function windowProvider(doc: Document): Window | ObWindow {
	return doc.defaultView ?? mockWindow;
}

function noop(): void {
	/* noop */
}
