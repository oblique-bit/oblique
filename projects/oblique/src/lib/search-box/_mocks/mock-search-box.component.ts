import {Component, Input} from '@angular/core';
import {ObISearchWidgetItem} from '../search-box.module';

@Component({
	selector: 'ob-search-box',
	exportAs: 'obSearchBox',
	template: ''
})
export class ObMockSearchBoxComponent {
	@Input() items: ObISearchWidgetItem[];
	@Input() placeholder = 'i18n.oblique.search.placeholder';
	@Input() minPatternLength = 1;
	@Input() maxResults = 10;
	@Input() slide = true;
	filteredItems: ObISearchWidgetItem[] = [];
	isOpened = false;
	id = 'search-input-0';
	pattern = '';
	open(): void {}

	close(): void {}
	navigateDown($event: KeyboardEvent): void {}

	navigateUp($event: KeyboardEvent): void {}

	exit(): void {}

	formatter(label: string, filterPattern?: string): string {
		return '';
	}

	focus(): void {}

	blur(): void {}

	click(evt: MouseEvent): void {}
}
