import {Injectable} from '@angular/core';
import {
	ObEScrollMode,
	ObIMasterLayoutFooter,
	ObIMasterLayoutHeader,
	ObIMasterLayoutNavigation,
} from '../master-layout.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Injectable({providedIn: 'root'})
export class ObMockMasterLayoutConfig {
	homePageRoute = '/home';
	scrollToTopDuration = 200;
	showAccessibilityTitle = true;
	layout = {
		hasCover: false,
		hasMainNavigation: true,
		hasOffCanvas: false,
		hasLayout: true,
		hasMaxWidth: false,
	};
	header: ObIMasterLayoutHeader = {
		isSticky: true,
		isSmall: false,
		isCustom: false,
		serviceNavigation: {},
	};
	navigation: ObIMasterLayoutNavigation = {
		isFullWidth: false,
		scrollMode: ObEScrollMode.AUTO,
		scrollDelta: 95,
		activeClass: 'active',
		links: [],
	};
	footer: ObIMasterLayoutFooter = {
		isSticky: false,
		isCustom: false,
	};
}
