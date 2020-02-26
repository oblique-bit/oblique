import {Directive, Input} from '@angular/core';
import {ObISearchWidgetItem} from '../search-box.module';

@Directive({
	selector: '[obSearchBox]',
	exportAs: 'obSearchBoxDirective'
})
export class ObMockSearchBoxDirective {
	@Input('obSearchBox') items: ObISearchWidgetItem[] = [];
	@Input() minPatternLength = 1;
	@Input() maxResults = 10;

	navigateDown($event: KeyboardEvent): void {
	}

	navigateUp($event: KeyboardEvent): void {
	}
}
