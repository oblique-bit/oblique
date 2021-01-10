export enum ObEScrollMode {
	AUTO,
	ENABLED,
	DISABLED
}

export interface ObIMasterLayoutHeader {
	isAnimated: boolean;
	isSticky: boolean;
	isMedium: boolean;
	isCustom: boolean;
	hasScrollTransitions: boolean;
}
export interface ObIMasterLayoutFooter {
	isSmall: boolean;
	isCustom: boolean;
	hasScrollTransitions: boolean;
}

export interface ObIMasterLayoutNavigation {
	isFullWidth: boolean;
	scrollMode: ObEScrollMode;
	scrollDelta: number;
	activeClass: string;
	links: ObINavigationLink[];
}

export interface ObILocale {
	locales: (string | ObILocaleObject)[];
	defaultLanguage: string;
	disabled: boolean;
	display: boolean;
}

export interface ObILocaleObject {
	locale: string;
	id?: string;
}

export interface ObINavigationLink {
	label: string;
	url: string;
	fragment?: string;
	queryParams?: {[key: string]: string};
	children?: ObINavigationLink[];
	sameTarget?: boolean;
	isExternal?: boolean;
	id?: string;
	active?: boolean;
}

export interface ObIJumpLink {
	label: string;
	url: string | 'current';
	fragment?: string;
}

export interface ObIDynamicJumpLink extends ObIJumpLink {
	accessKey: number;
}

export interface ObIMasterLayoutEvent {
	name: ObEMasterLayoutEventValues;
	value?: boolean;
	mode?: ObEScrollMode;
}

export enum ObEMasterLayoutEventValues {
	ANIMATE,
	COLLAPSE,
	COVER,
	CUSTOM,
	FIXED,
	FULL_WIDTH,
	OFF_CANVAS,
	MEDIUM,
	MAIN_NAVIGATION,
	SMALL,
	SCROLL_TRANSITION,
	SCROLLABLE,
	STICKY,
	LAYOUT
}
