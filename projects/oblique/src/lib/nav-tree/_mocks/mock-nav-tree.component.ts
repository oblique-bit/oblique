import {ChangeDetectionStrategy, Component, Input, input} from '@angular/core';
import {RouterLinkActive} from '@angular/router';
import {ObNavTreeItemModel} from '../nav-tree-item.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-nav-tree',
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
	host: {class: 'ob-nav-tree'},
	exportAs: 'obNavTree',
})
export class ObMockNavTreeComponent {
	static DEFAULTS = {
		VARIANT: 'ob-nav-bordered ob-nav-hover',
		HIGHLIGHT: 'ob-pattern-highlight',
		LABEL_FORMATTER: {},
	};

	readonly items = input<ObNavTreeItemModel[]>([]);
	@Input() prefix = 'nav-tree';
	readonly hasFilter = input(false);
	@Input() filterPattern: string;
	readonly labelFormatter = input<(item: ObNavTreeItemModel, filterPattern?: string) => string>(undefined);
	readonly treeAriaLabelledBy = input<string>(undefined);
	readonly treeAriaLabel = input<string>(undefined);

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
