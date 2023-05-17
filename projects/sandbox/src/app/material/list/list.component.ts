import {Component} from '@angular/core';

@Component({
	selector: 'sb-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss']
})
export class ListComponent {
	isDisabled = false;
	invertIconAndCheckbox = false;

	listType: 'list-without-icon' | 'list-with-icon' | 'selection-list-without-icon' | 'selection-list-with-icon' = 'list-with-icon';
	readonly listTypes = ['list-without-icon', 'list-with-icon', 'selection-list-without-icon', 'selection-list-with-icon'];

	readonly contentForList = [
		{
			id: 'list-item-1',
			label: 'List item 1',
			line1: 'Cadrozzi AG',
			line2: 'CHE-123.456.789 (active)',
			line3: 'Musterstrasse 99, 3000 Bern',
			icon: 'user-checkmark'
		},
		{
			id: 'list-item-2',
			label: 'List item 1',
			line1: 'Bananopa AG',
			line2: 'CHE-123.633.789',
			line3: 'Laupenfuss 59, 3002 Bern',
			icon: 'user'
		},
		{
			id: 'list-item-3',
			label: 'List item 1',
			line1: 'Lavani GmbH',
			line2: 'CHE-123.456.408 (active)',
			line3: 'Taubendorfstrasse 45, 3004 Bern',
			icon: 'user-checkmark'
		}
	];
}
