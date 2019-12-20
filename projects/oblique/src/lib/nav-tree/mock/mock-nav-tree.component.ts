import {Component, Input} from '@angular/core';
import {RouterLinkActive} from '@angular/router';
import {NavTreeItemModel} from '../nav-tree-item.model';

@Component({
	selector: 'or-nav-tree',
	exportAs: 'orNavTree',
	template: ''
})
export class MockNavTreeComponent {
	static DEFAULTS = {
		VARIANT: 'nav-bordered nav-hover',
		HIGHLIGHT: 'pattern-highlight',
		LABEL_FORMATTER: {}
	};

	@Input() items: NavTreeItemModel[] = [];
	@Input() prefix = 'nav-tree';
	@Input() filterPattern: string;
	@Input() labelFormatter: any;
	@Input() variant = MockNavTreeComponent.DEFAULTS.VARIANT;
	@Input() activateAncestors = true;

	@Input() patternMatcher(item: NavTreeItemModel, pattern = ''): boolean {
		return true;
	}

	visible(item: NavTreeItemModel): boolean {
		return true;
	}

	itemKey(item: NavTreeItemModel) {
		return `${this.prefix}-${item.id}`;
	}

	isLinkActive(rla: RouterLinkActive, item: NavTreeItemModel): boolean {
		return true;
	}

	changeCollapsed(items: NavTreeItemModel[], collapsed: boolean, all = false): void {
	}

	collapseAll(): void {
	}

	expandAll(): void {
	}
}
