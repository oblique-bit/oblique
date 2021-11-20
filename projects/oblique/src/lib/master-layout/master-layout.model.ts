import {IsActiveMatchOptions} from '@angular/router';

export enum ObEScrollMode {
	AUTO,
	ENABLED,
	DISABLED
}

export interface ObIMasterLayoutHeader {
	isSticky: boolean;
	isSmall: boolean;
	isCustom: boolean;
	reduceOnScroll: boolean;
}
export interface ObIMasterLayoutFooter {
	isSticky: boolean;
	isCustom: boolean;
	hasLogoOnScroll: boolean;
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
	routerLinkActiveOptions?: IsActiveMatchOptions;
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
	FOOTER_HAS_LOGO_ON_SCROLL,
	FOOTER_IS_CUSTOM,
	FOOTER_IS_STICKY,
	HEADER_IS_CUSTOM,
	HEADER_IS_SMALL,
	HEADER_IS_STICKY,
	HEADER_REDUCE_ON_SCROLL,
	IS_MENU_OPENED,
	LAYOUT_HAS_COVER,
	LAYOUT_HAS_DEFAULT_LAYOUT,
	LAYOUT_HAS_MAIN_NAVIGATION,
	LAYOUT_HAS_OFF_CANVAS,
	FULL_WIDTH,
	SCROLLABLE,
	MAX_WIDTH
}
