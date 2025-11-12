import {Component, Input} from '@angular/core';
import {RouterLinkActive} from '@angular/router';
import {ObNavTreeItemModel} from '../nav-tree-item.model';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Component({
	selector: 'ob-nav-tree',
	standalone: true,
	template: '',
	host: {class: 'ob-nav-tree'},
	exportAs: 'obNavTree',
})
export class ObMockNavTreeComponent {
	static DEFAULTS = {
		VARIANT: 'ob-nav-bordered ob-nav-hover',
		HIGHLIGHT: 'ob-pattern-highlight',
		LABEL_FORMATTER: {},
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
