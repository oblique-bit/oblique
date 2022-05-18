import {IsActiveMatchOptions} from '@angular/router';
import {InjectionToken} from '@angular/core';
import {ObEIcon} from '@oblique/icon/icon.model';

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
	languages: Record<string, string>;
}

export interface ObILocaleObject {
	locale: string;
	id?: string;
	label?: string;
}

export interface ObILanguage {
	code: string;
	id?: string;
}

export interface ObINavigationLink {
	label: string;
	url: string;
	fragment?: string;
	queryParams?: Record<string, string>;
	children?: ObINavigationLink[];
	sameTarget?: boolean;
	isExternal?: boolean;
	id?: string;
	active?: boolean;
	routerLinkActiveOptions?: IsActiveMatchOptions;
	icon?: ObEIcon | string;
	iconOnly?: boolean;
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
	LAYOUT_HAS_MAX_WIDTH,
	LAYOUT_HAS_OFF_CANVAS,
	NAVIGATION_IS_FULL_WIDTH,
	NAVIGATION_SCROLL_MODE
}

export enum ObEEnvironment {
	LOCAL = 'LOCAL',
	DEV = 'DEV',
	REF = 'REF',
	TEST = 'TEST',
	ABN = 'ABN'
}

export const OB_HIDE_EXTERNAL_LINKS_IN_MAIN_NAVIGATION = new InjectionToken<boolean>(
	'Are external links icons hidden in the main navigation'
);
