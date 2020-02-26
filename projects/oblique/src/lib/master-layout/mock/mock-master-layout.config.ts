import {Injectable} from '@angular/core';
import {ObEScrollMode} from '../master-layout.config';

@Injectable({providedIn: 'root'})
export class ObMockMasterLayoutConfig {
	homePageRoute = '/home';
	focusableFragments = ['content', 'navigation'];
	scrollToTopDuration = 200;
	locale = {
		locales: ['de', 'fr', 'it'],
		default: 'de',
		disabled: false
	};
	layout = {
		isFixed: false,
		hasCover: false,
		hasMainNavigation: true,
		hasOffCanvas: true,
		hasLayout: true
	};
	header = {
		isAnimated: true,
		isSticky: true,
		isMedium: false,
		isCustom: false,
		hasScrollTransitions: true
	};
	navigation = {
		isFullWidth: false,
		scrollMode: ObEScrollMode.AUTO,
		scrollDelta: 95,
		activeClass: 'active',
		links: []
	};
	footer = {
		isSmall: true,
		isCustom: false,
		hasScrollTransitions: true
	};
}
