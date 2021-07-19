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

	open(): void {}

	close(): void {}
}
