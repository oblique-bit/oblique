import {Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ObISearchWidgetItem} from './search-box.component';

@Component({
	selector: 'ob-search-box-results',
	exportAs: 'obSearchBoxResults',
	templateUrl: './search-box-results.component.html',
	styleUrls: ['./search-box-results.component.scss', '../nav-tree/nav-tree.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-search-box-results'}
})
export class ObSearchBoxResultsComponent implements OnDestroy {
	@Input() input: ElementRef;
	@Input() items: ObISearchWidgetItem[] = [];
	@Input() minPatternLength = 1;
	@Input() maxResults = 10;
	@Output() closed = new EventEmitter<void>();
	showResults = false;
	filteredItems: ObISearchWidgetItem[] = [];
	private active: number;
	private _pattern = '';
	@ViewChildren('link') private readonly links: QueryList<ElementRef>;

	constructor(private readonly translate: TranslateService) {}

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

	@HostListener('keydown.escape') close(): void {
		this.pattern = '';
		this.filteredItems = [];
		this.active = undefined;
		this.closed.emit();
	}

	get pattern(): string {
		return this._pattern;
	}

	@Input() set pattern(pattern: string) {
		this._pattern = pattern;
		this.filteredItems = this.items.filter(this.filterItems.bind(this)).slice(0, this.maxResults);
		this.showResults = this.pattern.length >= this.minPatternLength;
	}

	ngOnDestroy(): void {
		this.closed.emit();
		this.closed.complete();
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
