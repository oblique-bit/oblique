import {IsActiveMatchOptions} from '@angular/router';
import {InjectionToken} from '@angular/core';
import {ObEIcon} from '../icon/icon.model';
import {ObIServiceNavigationContact, ObIServiceNavigationLink} from '../service-navigation/service-navigation.model';

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
	readonly serviceNavigation: ObIServiceNavigationConfig;
}

export interface ObIServiceNavigationConfig {
	profileLinks?: ObIServiceNavigationLink[];
	infoLinks?: ObIServiceNavigationLink[];
	infoContact?: ObIServiceNavigationContact;
	maxLastUsedApplications?: number;
	maxFavoriteApplications?: number;
	returnUrl?: string;
	displayApplications?: boolean;
	displayAuthentication?: boolean;
	displayInfo?: boolean;
	displayLanguages?: boolean;
	displayMessage?: boolean;
	displayProfile?: boolean;
	handleLogout?: boolean;
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
	startOfRightSideLinks?: boolean;
}

export interface ObISkipLink {
	label: string;
	url: string | 'current';
	fragment?: string;
}

export interface ObIDynamicSkipLink extends ObISkipLink {
	accessKey: number;
}

export interface ObIMasterLayoutEvent {
	name: ObEMasterLayoutEventValues;
	value?: boolean;
	mode?: ObEScrollMode;
	config?: ObIServiceNavigationConfig;
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
	NAVIGATION_SCROLL_MODE,
	SERVICE_NAVIGATION_CONFIGURATION
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

export type ObLanguageSelectorType = 'dropdown' | 'tabs';
