import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NavTreeItemModel} from './nav-tree-item.model';

@Component({
	selector: 'nav-tree',
	templateUrl: './nav-tree.component.html',
	exportAs: 'navTree',
	// Ensure CSS styles are added to global styles as search pattern highlighting is done at runtime:
	// (see also: https://angular.io/docs/ts/latest/guide/component-styles.html#!#view-encapsulation)
	encapsulation: ViewEncapsulation.None,
	styles: [`
		.nav-tree-pattern-highlight {
			font-weight: bold;
			text-decoration: underline;
		}
	`]
})
export class NavTreeComponent {

	public static DEFAULTS = {
		HIGHLIGHT: 'nav-tree-pattern-highlight',
		LABEL_FORMATTER: (item: NavTreeItemModel, filterPattern: string) => {
			return !filterPattern ? item.label : item.label.replace(
				new RegExp(filterPattern, 'ig'),
				function (text) {
					return `<span class="${NavTreeComponent.DEFAULTS.HIGHLIGHT}">${text}</span>`;
				}
			);
		}
	};

	@Input()
	items: Array<NavTreeItemModel>;

	@Input()
	prefix = 'nav-tree';

	@Input()
	filterPattern: string;

	@Input()
	labelFormatter: (item: NavTreeItemModel, filterPattern) => string = NavTreeComponent.DEFAULTS.LABEL_FORMATTER;

	@Input()
	linkBuilder(item: NavTreeItemModel): string {
		return item.id;
	};

	@Input()
	patternMatcher(item: NavTreeItemModel, pattern: string): boolean {
		let match = new RegExp(pattern, 'gi').test(item.label);
		return match || (item.items || []).some((subItem) => {
				return this.patternMatcher(subItem, pattern);
			});
	}

	visible(item: NavTreeItemModel) {
		return !this.filterPattern || this.patternMatcher(item, this.filterPattern);
	}

	itemKey(item: NavTreeItemModel) {
		return this.prefix + '-' + item.id;
	}

	collapse(items: NavTreeItemModel[], all: boolean = false) {
		items
			.filter((item) => item.items)
			.forEach((item: NavTreeItemModel) => {
				item.collapsed = true;
				if (all) {
					this.collapse(item.items, all);
				}
			});
	};

	expand(items: NavTreeItemModel[], all: boolean = false) {
		items
			.filter((item) => item.items)
			.forEach((item: NavTreeItemModel) => {
				item.collapsed = false;
				if (all) {
					this.expand(item.items, all);
				}
			});
	};

	// Public API:
	public collapseAll() {
		this.collapse(this.items, true);
	};

	public expandAll() {
		this.expand(this.items, true);
	}
}
