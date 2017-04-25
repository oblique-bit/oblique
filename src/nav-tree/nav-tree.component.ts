import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NavTreeItemModel} from './nav-tree-item.model';

@Component({
	selector: 'nav-tree',
	templateUrl: './nav-tree.component.html',
	exportAs: 'navTree',
	styles: [`
		.nav-tree-pattern-highlight {
			font-weight: bold;
			text-decoration: underline;
		}
	`],
	// Ensure CSS styles are added to global styles as search pattern highlighting is done at runtime:
	// (see also: https://angular.io/docs/ts/latest/guide/component-styles.html#!#view-encapsulation)
	encapsulation: ViewEncapsulation.None
})
export class NavTreeComponent {

	@Input()
	items: Array<NavTreeItemModel>;

	@Input()
	prefix = 'nav-tree';

	@Input()
	header: string;

	@Input()
	filterPattern: string;

	@Input()
	labelFormatter(label: string): string {
		return !this.filterPattern ? label : label.replace(new RegExp(this.filterPattern, 'ig'), function (text) {
			return '<span class="nav-tree-pattern-highlight">' + text + '</span>';
		});
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
}
