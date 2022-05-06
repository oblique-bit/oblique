import {Injectable} from '@angular/core';
import {ObEScrollMode, ObILocale, ObIMasterLayoutFooter, ObIMasterLayoutHeader, ObIMasterLayoutNavigation} from '../master-layout.model';

@Injectable({providedIn: 'root'})
export class ObMockMasterLayoutConfig {
	homePageRoute = '/home';
	focusableFragments = ['content', 'navigation'];
	scrollToTopDuration = 200;
	locale: ObILocale = {
		locales: ['de-CH', 'fr-CH', 'it-CH'],
		defaultLanguage: 'de',
		disabled: false,
		display: true
	};
	layout = {
		hasCover: false,
		hasMainNavigation: true,
		hasOffCanvas: false,
		hasLayout: true,
		hasMaxWidth: false
	};
	header: ObIMasterLayoutHeader = {
		isSticky: true,
		isSmall: false,
		isCustom: false,
		reduceOnScroll: true
	};
	navigation: ObIMasterLayoutNavigation = {
		isFullWidth: false,
		scrollMode: ObEScrollMode.AUTO,
		scrollDelta: 95,
		activeClass: 'active',
		links: []
	};
	footer: ObIMasterLayoutFooter = {
		isSticky: false,
		isCustom: false,
		hasLogoOnScroll: true
	};
}
