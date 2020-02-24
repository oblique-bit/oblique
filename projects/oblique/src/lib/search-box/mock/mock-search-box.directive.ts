import {Directive, Input} from '@angular/core';
import {SearchWidgetItem} from '../search-box.module';

@Directive({
	selector: '[orSearchBox]',
	exportAs: 'orSearchBoxDirective'
})
export class MockSearchBoxDirective {
	@Input('orSearchBox') items: SearchWidgetItem[] = [];
	@Input() minPatternLength = 1;
	@Input() maxResults = 10;

	navigateDown($event: KeyboardEvent): void {
	}

	navigateUp($event: KeyboardEvent): void {
	}
}
