import {Component, Input} from '@angular/core';
import {SearchWidgetItem} from '../search-box.module';

@Component({
	selector: 'or-search-box',
	exportAs: 'orSearchBox',
	template: ''
})
export class MockSearchBoxComponent {
	@Input() items: SearchWidgetItem[];
	@Input() placeholder = 'i18n.oblique.search.placeholder';
	@Input() minPatternLength = 1;
	@Input() maxResults = 10;
	@Input() slide = true;

	open(): void {
	}

	close(): void {
	}
}
