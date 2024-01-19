import {Component, Input} from '@angular/core';
import {ObINavigationLink} from '../master-layout.module';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Component({
	selector: 'ob-master-layout-navigation',
	exportAs: 'obMasterLayoutNavigation',
	template: ''
})
export class ObMockMasterLayoutNavigationComponent {
	isFullWidth = true;
	activeClass = '';
	currentScroll = 0;
	maxScroll = 0;
	@Input() links: ObINavigationLink[] = [];
	isScrollable = true;

	isActive(url: string): boolean {
		return true;
	}

	onResize(): void {}

	close(): void {}

	scrollLeft(): void {}

	scrollRight(): void {}
}
