import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	HostBinding,
	HostListener,
	Input,
	QueryList,
	ViewChild,
	ViewChildren,
	ViewEncapsulation
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ObPopoverDirective} from '../popover/popover.directive';
import {ObISearchWidgetItem} from './search-box.model';

let nextId = 0;

/**
 * TODO this really needs some refactoring, but until Oblique 7, this is the only solution to avoid a breaking change
 */
/**
 * @deprecated since version 10.0.0. It will be removed with Oblique 11. Autocomplete should be used instead.
 */
@Component({
	selector: 'ob-search-box',
	exportAs: 'obSearchBox',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './search-box.component.html',
	styleUrls: ['./search-box.component.scss', '../nav-tree/nav-tree.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-search-box', role: 'search'}
})
export class ObSearchBoxComponent {
	@Input() items: ObISearchWidgetItem[] = [];
	@Input() placeholder = 'i18n.oblique.search.placeholder';
	@Input() minPatternLength = 1;
	@Input() maxResults = 10;
	@Input() @HostBinding('class.ob-slide-control') slide = true;
	filteredItems: ObISearchWidgetItem[] = [];
	isOpened = false;
	id = `search-input-${nextId++}`;
	private active: number;
	@ViewChildren('link') private readonly links: QueryList<ElementRef>;
	@ViewChild(ObPopoverDirective) private readonly popover: ObPopoverDirective;

	private patternInternal: string;

	get pattern(): string {
		return this.patternInternal;
	}

	@Input() set pattern(pattern: string) {
		this.patternInternal = pattern;
		this.filteredItems = this.items.filter(this.filterItems.bind(this)).slice(0, this.maxResults);
		this.toggle(this.pattern.length >= this.minPatternLength);
	}

	constructor(private readonly translate: TranslateService, private readonly el: ElementRef) {}

	open(): void {
		this.toggle(true);
	}

	close(): void {
		this.toggle(false);
	}

	@HostListener('window:keydown.arrowdown', ['$event']) navigateDown($event: KeyboardEvent): void {
		if (this.isOpened) {
			this.focusLink(this.active === undefined ? 0 : (this.active + 1) % this.filteredItems.length);
			if ($event) {
				$event.preventDefault();
			}
		}
	}

	@HostListener('window:keydown.arrowup', ['$event']) navigateUp($event: KeyboardEvent): void {
		if (this.isOpened) {
			this.focusLink(
				this.active === undefined
					? this.filteredItems.length - 1
					: (this.active - 1 + this.filteredItems.length) % this.filteredItems.length
			);
			if ($event) {
				$event.preventDefault();
			}
		}
	}

	@HostListener('window:keydown.escape') exit(): void {
		if (this.isOpened) {
			this.pattern = '';
			this.filteredItems = [];
			this.active = undefined;
		}
	}

	@HostListener('window:click', ['$event']) blur($event: PointerEvent): void {
		if (!(this.el.nativeElement as Node).contains($event.target as Node)) {
			this.close();
		}
	}

	formatter(label: string, filterPattern?: string): string {
		const pattern = (filterPattern || '').replace(/[.*+?^@${}()|[\]\\]/g, '\\$&');
		return pattern ? label.replace(new RegExp(pattern, 'ig'), text => `<span class="ob-highlight">${text}</span>`) : label;
	}

	focus(): void {
		if (this.pattern?.length >= this.minPatternLength) {
			this.toggle(true);
		}
	}

	private toggle(state: boolean): void {
		if (state !== this.isOpened) {
			if (state) {
				this.popover.open();
			} else {
				this.popover.close();
			}
			this.isOpened = state;
		}
	}

	private filterItems(item: ObISearchWidgetItem): boolean {
		return (
			this.pattern.length >= this.minPatternLength &&
			new RegExp(this.pattern.replace(/[.*+?^@${}()|[\]\\]/g, '\\$&'), 'gi').test(this.translate.instant(item.label))
		);
	}

	private focusLink(index: number): void {
		this.active = index;
		this.links
			.toArray()
			.map(link => link.nativeElement as HTMLElement)
			.filter(link => this.filterOutUnboundedElements(link))
			[this.active].focus();
	}

	private filterOutUnboundedElements(link: HTMLElement): boolean {
		// each time the popover is opened, a new list of results is created. The `links` QueryList lists
		// all results, including the ones that are no in the DOM anymore. Those are filtered out by
		// looking at their root node. If it's not document, then they are ignored.
		// This is a memory leak and is only acceptable because the search-box is deprecated
		return link.getRootNode().nodeType === 9; // 9 is document
	}
}
