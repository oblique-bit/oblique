import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {NgOptimizedImage} from '@angular/common';

@Component({
	selector: 'app-list-group-example-avatar-subheader',
	templateUrl: './list-group-example-avatar-subheader.component.html',
	imports: [MatListModule, MatIconModule, NgOptimizedImage],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListGroupExampleAvatarSubheaderComponent {
	readonly contentForList = [
		{
			id: 'list-item-1',
			label: 'List item 1',
			line1: 'Cadrozzi AG',
			line2: 'CHE-123.456.789 (active)',
			line3: 'Musterstrasse 99, 3000 Bern',
			icon: 'user-checkmark',
			avatar: 'assets/images/ListGroupImageExample.jpg'
		},
		{
			id: 'list-item-2',
			label: 'List item 1',
			line1: 'Bananopa AG',
			line2: 'CHE-123.633.789',
			line3: 'Laupenfuss 59, 3002 Bern',
			icon: 'user',
			avatar: 'assets/images/ListGroupImageExample.jpg'
		},
		{
			id: 'list-item-3',
			label: 'List item 1',
			line1: 'Lavani GmbH',
			line2: 'CHE-123.456.408 (active)',
			line3: 'Taubendorfstrasse 45, 3004 Bern',
			icon: 'user-checkmark',
			avatar: 'assets/images/ListGroupImageExample.jpg'
		}
	];
}
