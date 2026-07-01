import {ChangeDetectionStrategy, Component, Input, output} from '@angular/core';
import {ObINavigationLink} from '../master-layout.module';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-master-layout-navigation',
	standalone: false,
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
	exportAs: 'obMasterLayoutNavigation',
})
export class ObMockMasterLayoutNavigationComponent {
	isFullWidth = true;
	activeClass = '';
	currentScroll = 0;
	maxScroll = 0;
	@Input() links: ObINavigationLink[] = [];
	readonly linksChanged = output<ObINavigationLink[]>();
	isScrollable = true;

	isActive(url: string): boolean {
		return true;
	}

	onResize(): void {}

	close(): void {}

	scrollLeft(): void {}

	scrollRight(): void {}
}
