import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';

@Component({
	standalone: true,
	selector: 'app-list-group-example-icon',
	templateUrl: './list-group-example-icon.component.html',
	imports: [MatListModule, MatIconModule, CommonModule],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListGroupExampleIconComponent implements PreviewComponent {
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
