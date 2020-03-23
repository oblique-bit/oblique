import {ChangeDetectionStrategy, Component, HostBinding, Input, OnInit, ViewEncapsulation} from '@angular/core';

export interface ObISearchWidgetItem {
	id: string;
	label: string;
	routes: string[];
	fragment?: string;
	description?: string;
}

let nextId = 0;

@Component({
	selector: 'ob-search-box',
	exportAs: 'obSearchBox',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './search-box.component.html',
	styleUrls: ['./search-box.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'search-box', role: 'search'}
})
export class ObSearchBoxComponent implements OnInit {
	@Input() items: ObISearchWidgetItem[];
	@Input() placeholder = 'i18n.oblique.search.placeholder';
	@Input() minPatternLength = 1;
	@Input() maxResults = 10;
	@Input() @HostBinding('class.slide-control') slide = true;
	pattern: string;
	isOpened = false;
	id = `search-input-${nextId++}`;

	ngOnInit() {
		this.isOpened = !this.slide;
	}

	open(): void {
		this.isOpened = true;
	}

	close(): void {
		if (this.slide) {
			this.isOpened = false;
		}
	}
}
