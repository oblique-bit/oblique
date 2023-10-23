import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';

@Component({
	selector: 'app-list-group-example-image-preview',
	templateUrl: './list-group-example-image-preview.component.html',
	standalone: true,
	imports: [MatListModule, MatIconModule, CommonModule],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListGroupExampleImagePreviewComponent {
	readonly contentForList = [
		{
			id: 'list-item-1',
			label: 'List item 1',
			line1: 'Cadrozzi AG',
			line2: 'CHE-123.456.789 (active)',
			line3: 'Musterstrasse 99, 3000 Bern'
		},
		{
			id: 'list-item-2',
			label: 'List item 1',
			line1: 'Bananopa AG',
			line2: 'CHE-123.633.789',
			line3: 'Laupenfuss 59, 3002 Bern'
		},
		{
			id: 'list-item-3',
			label: 'List item 1',
			line1: 'Lavani GmbH',
			line2: 'CHE-123.456.408 (active)',
			line3: 'Taubendorfstrasse 45, 3004 Bern'
		}
	];
}
