import {Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SearchWidgetItem} from './search-box.component';
import {MasterLayoutService} from '../master-layout/master-layout.module';

@Component({
	selector: 'or-search-box-results',
	exportAs: 'orSearchBoxResults',
	template: `
		<ul class="search-results-list nav nav-tree nav-bordered nav-hover" [class.hasResults]="showResults">
			<li class="nav-item" *ngFor="let item of filteredItems">
				<a [routerLink]="item.routes" [fragment]="item.fragment" class="nav-link" #link (click)="close()">
					<span [innerHTML]="formatter(item.label | translate, pattern)"></span>
					<small *ngIf="item.description">{{item.description}}</small>
				</a>
			</li>
			<li class="nav-item noResult">{{'i18n.oblique.search.noResults' | translate}}</li>
		</ul>
	`,
	styles: [`
		or-search-box-results {
			width: 100%;
		}

		.search-results-list {
			top: 113px;
			left: 0;
			right: 0;
			height: 0;
			background-color: #ffffff;
			overflow: hidden;
			transition: height 0.6s;
		}

		.control-link .search-results-list {
			position: fixed;
		}

		.search-results-list.nav-hover .nav-item .nav-link.active:after,
		.search-results-list.nav-hover .nav-item .nav-link:hover:after,
		.search-results-list.nav-hover .nav-item .nav-link:focus:after {
			left: 0;
		}

		:hover > or-search-box-results .search-results-list.hasResults,
		:focus-within > or-search-box-results .search-results-list.hasResults {
			height: unset;
		}

		.search-results-list .highlight {
			font-weight: bold;
			text-decoration: underline;
		}

		.search-results-list small {
			color: #6c757d;
			display: block;
		}

		.noResult {
			padding: 8px 15px;
		}

		.noResult:not(:only-child) {
			display: none;
		}

		@media (min-width: 992px) {
			.control-link .search-results-list {
				position: absolute;
			}

			.search-results-list {
				display: block;
				position: absolute;
				top: unset;
				height: unset;
				left: -20px;
				min-width: 300px;
				max-height: 0;
				padding: 0 15px;
				margin-top: 29px;
				background-color: white;
				box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
				transition: max-height 0.6s, padding 0.6s;
				z-index: 1;
			}

			.search-results-list.nav-hover .nav-item .nav-link.active:after,
			.search-results-list.nav-hover .nav-item .nav-link:hover:after,
			.search-results-list.nav-hover .nav-item .nav-link:focus:after {
				left: -15px;
			}

			:hover > or-search-box-results .search-results-list.hasResults,
			:focus-within > or-search-box-results .search-results-list.hasResults {
				max-height: calc(100vh - 200px);
				height: unset;
				padding: 15px;
				overflow: unset;
				border: 1px solid #d5d5d5;
			}

			.search-results-list::before,
			.search-results-list::after {
				content: '';
				display: block;
				position: absolute;
				border-style: solid;
				transition: right 0.6s, left 0.6s;
			}

			.search-results-list::before {
				left: 15px;
				top: -15px;
				border-width: 0 15px 15px;
				border-color: #d5d5d5 transparent;
			}

			.search-results-list::after {
				left: 16px;
				top: -14px;
				border-width: 0 14px 14px;
				border-color: white transparent;
			}
		}
	`],
	encapsulation: ViewEncapsulation.None
})
export class SearchBoxResultsComponent implements OnDestroy {
	@Input() input: ElementRef;
	@Input() items: SearchWidgetItem[] = [];
	@Input() minPatternLength = 1;
	@Input() maxResults = 10;
	@Output() closed = new EventEmitter<void>();
	showResults = false;
	filteredItems: SearchWidgetItem[] = [];
	private active: number;
	private _pattern = '';
	@ViewChildren('link') private readonly links: QueryList<ElementRef>;

	constructor(private readonly translate: TranslateService, private readonly master: MasterLayoutService) {
	}

	@HostListener('keydown.arrowdown') navigateDown() {
		this.focusLink(this.active != null ? (this.active + 1) % this.filteredItems.length : 0);
	}

	@HostListener('keydown.arrowup') navigateUp() {
		this.focusLink(this.active != null ? (this.active - 1 + this.filteredItems.length) % this.filteredItems.length : this.filteredItems.length - 1);
	}

	@HostListener('keydown.escape') close(): void {
		this.pattern = '';
		this.filteredItems = [];
		this.active = undefined;
		this.closed.emit();
		this.master.menuCollapsed = true;
	}

	get pattern(): string {
		return this._pattern;
	}

	@Input() set pattern(pattern: string) {
		this._pattern = pattern;
		this.filteredItems = this.items
			.filter(this.filterItems.bind(this))
			.slice(0, this.maxResults);
		this.showResults = this.pattern.length >= this.minPatternLength;
	}

	ngOnDestroy(): void {
		this.closed.emit();
		this.closed.complete();
	}

	formatter(label: string, filterPattern?: string): string {
		filterPattern = (filterPattern || '').replace(/[.*+?^@${}()|[\]\\]/g, '\\$&');
		return !filterPattern ? label : label.replace(new RegExp(filterPattern, 'ig'), (text) => `<span class="highlight">${text}</span>`);
	}

	private filterItems(item: SearchWidgetItem): boolean {
		return this.pattern.length >= this.minPatternLength
			&& new RegExp(this.pattern.replace(/[.*+?^@${}()|[\]\\]/g, '\\$&'), 'gi').test(this.translate.instant(item.label));
	}

	private focusLink(index: number): void {
		this.active = index;
		this.links.toArray()[this.active].nativeElement.focus();
	}
}
