import {Component, Input} from '@angular/core';
import {RouterLinkActive} from '@angular/router';
import {ObNavTreeItemModel} from '../nav-tree-item.model';

@Component({
	selector: 'ob-nav-tree',
	exportAs: 'obNavTree',
	template: ''
})
export class ObMockNavTreeComponent {
	static DEFAULTS = {
		VARIANT: 'nav-bordered nav-hover',
		HIGHLIGHT: 'pattern-highlight',
		LABEL_FORMATTER: {}
	};

	@Input() items: ObNavTreeItemModel[] = [];
	@Input() prefix = 'nav-tree';
	@Input() filterPattern: string;
	@Input() labelFormatter: any;
	@Input() variant = ObMockNavTreeComponent.DEFAULTS.VARIANT;
	@Input() activateAncestors = true;

	@Input() patternMatcher(item: ObNavTreeItemModel, pattern = ''): boolean {
		return true;
	}

	visible(item: ObNavTreeItemModel): boolean {
		return true;
	}

	itemKey(item: ObNavTreeItemModel) {
		return `${this.prefix}-${item.id}`;
	}

	isLinkActive(rla: RouterLinkActive, item: ObNavTreeItemModel): boolean {
		return true;
	}

	changeCollapsed(items: ObNavTreeItemModel[], collapsed: boolean, all = false): void {
	}

	collapseAll(): void {
	}

	expandAll(): void {
	}
}
