import {Component, Input} from '@angular/core';
import {RouterLinkActive} from '@angular/router';
import {ObNavTreeItemModel} from '../nav-tree-item.model';

@Component({
	selector: 'ob-nav-tree',
	exportAs: 'obNavTree',
	host: {class: 'ob-nav-tree'},
	template: ''
})
export class ObMockNavTreeComponent {
	static DEFAULTS = {
		VARIANT: 'ob-nav-bordered ob-nav-hover',
		HIGHLIGHT: 'ob-pattern-highlight',
		LABEL_FORMATTER: {}
	};

	@Input() items: ObNavTreeItemModel[] = [];
	@Input() prefix = 'nav-tree';
	@Input() filterPattern: string;
	@Input() labelFormatter: any;

	@Input() patternMatcher(item: ObNavTreeItemModel, pattern = ''): boolean {
		return true;
	}

	visible(item: ObNavTreeItemModel): boolean {
		return true;
	}

	itemKey(item: ObNavTreeItemModel): string {
		return `${this.prefix}-${item.id}`;
	}

	isLinkActive(rla: RouterLinkActive, item: ObNavTreeItemModel): boolean {
		return true;
	}

	changeCollapsed(items: ObNavTreeItemModel[], collapsed: boolean, all = false): void {}

	collapseAll(): void {}

	expandAll(): void {}
}
