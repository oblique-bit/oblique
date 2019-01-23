import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

export interface SearchWidgetItem {
	id: string;
	label: string;
	routes: string[];
	fragment?: string;
	description?: string;
}

let nextId = 0;

@Component({
	selector: 'or-search-box',
	exportAs: 'orSearchBox',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div role="search" class="search-box" [class.slide-control]="slide">
			<label class="control-toggle" for="{{id}}">
				<span class="control-icon fa fa-search"></span>
				<span class="control-label sr-only">{{'i18n.oblique.search.title' | translate}}</span>
			</label>
			<input [id]="id" class="search-box-input" type="search" placeholder="{{placeholder | translate}}" role="searchbox" [orSearchBox]="items"
				   [(ngModel)]="pattern" [minPatternLength]="minPatternLength" [maxResults]="maxResults"/>
		</div>
	`,
	styles: [`
		.search-box {
			flex-wrap: wrap;
		}

		.search-box::before {
			top: 24px;
			bottom: unset;
		}

		.search-box.slide-control:focus-within .search-box-input {
			max-width: 400px;
		}

		.search-box:not(.slide-control)::before,
		.search-box.slide-control:focus-within::before,
		.search-box.slide-control:hover::before {
			border-color: #b4b4b4;
		}
	`],
	encapsulation: ViewEncapsulation.None
})
export class SearchBoxComponent implements OnInit {
	@Input() items: SearchWidgetItem[];
	@Input() placeholder = 'i18n.oblique.search.placeholder';
	@Input() minPatternLength = 1;
	@Input() maxResults = 10;
	@Input() slide = true;
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
