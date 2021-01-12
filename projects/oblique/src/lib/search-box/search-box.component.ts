import {ElementRef, HostListener, QueryList, ViewChildren} from '@angular/core';
import {ChangeDetectionStrategy, Component, HostBinding, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

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
	styleUrls: ['./search-box.component.scss', '../nav-tree/nav-tree.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-search-box', role: 'search'}
})
export class ObSearchBoxComponent implements OnInit {
	@Input() items: ObISearchWidgetItem[] = [];
	@Input() placeholder = 'i18n.oblique.search.placeholder';
	@Input() minPatternLength = 1;
	@Input() maxResults = 10;
	@Input() @HostBinding('class.ob-slide-control') slide = true;
	filteredItems: ObISearchWidgetItem[] = [];
	isOpened = false;
	id = `search-input-${nextId++}`;
	private active: number;
	private _pattern: string;

	@ViewChildren('link') private readonly links: QueryList<ElementRef>;

	constructor(private readonly translate: TranslateService) {}

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

	get pattern(): string {
		return this._pattern;
	}

	@Input() set pattern(pattern: string) {
		this._pattern = pattern;
		this.filteredItems = this.items.filter(this.filterItems.bind(this)).slice(0, this.maxResults);
		this.isOpened = this.pattern.length >= this.minPatternLength;
	}

	@HostListener('keydown.arrowdown', ['$event']) navigateDown($event: KeyboardEvent) {
		this.focusLink(this.active != null ? (this.active + 1) % this.filteredItems.length : 0);
		if ($event) {
			$event.preventDefault();
		}
	}

	@HostListener('keydown.arrowup', ['$event']) navigateUp($event: KeyboardEvent) {
		this.focusLink(this.active != null ? (this.active - 1 + this.filteredItems.length) % this.filteredItems.length : this.filteredItems.length - 1);
		if ($event) {
			$event.preventDefault();
		}
	}

	@HostListener('keydown.escape') exit(): void {
		this.pattern = '';
		this.filteredItems = [];
		this.active = undefined;
	}

	formatter(label: string, filterPattern?: string): string {
		filterPattern = (filterPattern || '').replace(/[.*+?^@${}()|[\]\\]/g, '\\$&');
		return !filterPattern ? label : label.replace(new RegExp(filterPattern, 'ig'), text => `<span class="highlight">${text}</span>`);
	}

	private filterItems(item: ObISearchWidgetItem): boolean {
		return (
			this.pattern.length >= this.minPatternLength &&
			new RegExp(this.pattern.replace(/[.*+?^@${}()|[\]\\]/g, '\\$&'), 'gi').test(this.translate.instant(item.label))
		);
	}

	private focusLink(index: number): void {
		this.active = index;
		this.links.toArray()[this.active].nativeElement.focus();
	}
}
