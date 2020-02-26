import {Component, Input} from '@angular/core';
import {ObNavigationLink} from '../master-layout.module';

@Component({
	selector: 'ob-master-layout-navigation',
	template: ''
})
export class ObMockMasterLayoutNavigationComponent {
	isFullWidth = true;
	activeClass = '';
	currentScroll = 0;
	maxScroll = 0;
	@Input() links: ObNavigationLink[] = [];
	isScrollable = true;

	isActive(url: string): boolean {
		return true;
	}

	onResize(): void {
	}

	close(): void {
	}

	scrollLeft(): void {
	}

	scrollRight(): void {
	}
}
