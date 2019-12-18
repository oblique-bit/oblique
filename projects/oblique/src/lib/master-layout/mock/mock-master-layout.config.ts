import {Injectable} from '@angular/core';
import {ScrollMode} from '../master-layout.config';

@Injectable({providedIn: 'root'})
export class MockMasterLayoutConfig {
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
		hasOffCanvas: true
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
		scrollMode: ScrollMode.AUTO,
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
