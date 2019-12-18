import {Component, Input} from '@angular/core';
import {ORNavigationLink} from '../master-layout.module';

@Component({
	selector: 'or-master-layout-navigation',
	template: ''
})
export class MockMasterLayoutNavigationComponent {
	isFullWidth = true;
	activeClass = '';
	currentScroll = 0;
	maxScroll = 0;
	@Input() links: ORNavigationLink[] = [];
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
