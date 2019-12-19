import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, RouterLinkActive} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../unsubscribe.class';
import {NavTreeItemModel} from './nav-tree-item.model';

@Component({
	selector: 'or-nav-tree',
	exportAs: 'orNavTree',
	templateUrl: './nav-tree.component.html',
	styleUrls: ['./nav-tree.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class NavTreeComponent extends Unsubscribable {
	static DEFAULTS = {
		VARIANT: 'nav-bordered nav-hover',
		HIGHLIGHT: 'pattern-highlight',
		LABEL_FORMATTER: defaultLabelFormatterFactory
	};

	activeFragment: string; // TODO: remove when https://github.com/angular/angular/issues/13205
	@Input() items: NavTreeItemModel[] = [];
	@Input() prefix = 'nav-tree';
	@Input() filterPattern: string;
	@Input() labelFormatter: (item: NavTreeItemModel, filterPattern?: string) => string = NavTreeComponent.DEFAULTS.LABEL_FORMATTER(this.translate);
	@Input() variant = NavTreeComponent.DEFAULTS.VARIANT;
	@Input() activateAncestors = true;

	// TODO: remove when https://github.com/angular/angular/issues/13205
	constructor(private readonly route: ActivatedRoute, private readonly translate: TranslateService) {
		super();
		this.route.fragment
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((fragment) => {
				this.activeFragment = fragment;
			});
	}

	@Input()
	patternMatcher(item: NavTreeItemModel, pattern = ''): boolean {
		pattern = pattern.replace(/[.*+?^@${}()|[\]\\]/g, '\\$&');
		const label = this.translate.instant(item.label);
		const match = new RegExp(pattern, 'gi').test(label);
		const childMatch = (item.items || []).some((subItem) => {
			const subMatch = this.patternMatcher(subItem, pattern.replace(/\\/g, ''));
			if (subMatch) {
				// Ensure parent item is not collapsed:
				item.collapsed = false;
			}
			return subMatch;
		});
		return match || childMatch;
	}

	visible(item: NavTreeItemModel) {
		return !this.filterPattern || this.patternMatcher(item, this.filterPattern);
	}

	itemKey(item: NavTreeItemModel) {
		return `${this.prefix}-${item.id}`;
	}

	// TODO: remove when https://github.com/angular/angular/issues/13205
	isLinkActive(rla: RouterLinkActive, item: NavTreeItemModel) {
		const isLinkActive = rla.isActive;
		return item.fragment
			? isLinkActive && this.activeFragment === item.fragment
			: isLinkActive;
	}

	changeCollapsed(items: NavTreeItemModel[], collapsed: boolean, all = false): void {
		items
			.filter((item) => item.items)
			.forEach((item: NavTreeItemModel) => {
				item.collapsed = collapsed;
				if (all) {
					this.changeCollapsed(item.items, collapsed, all);
				}
			});
	}

	// Public API:
	public collapseAll() {
		this.changeCollapsed(this.items, true, true);
	}

	public expandAll() {
		this.changeCollapsed(this.items, false, true);
	}
}

// FIXME: refactor this when https://github.com/angular/angular/issues/14485
export function defaultLabelFormatterFactory(translate: TranslateService) {
	// noinspection UnnecessaryLocalVariableJS because this will result in a build error
	const formatter = (item: NavTreeItemModel, filterPattern: string) => {
		filterPattern = (filterPattern || '').replace(/[.*+?^@${}()|[\]\\]/g, '\\$&');
		const label = translate.instant(item.label);
		return !filterPattern ? label : label.replace(
			new RegExp(filterPattern, 'ig'), (text) => `<span class="${NavTreeComponent.DEFAULTS.HIGHLIGHT}">${text}</span>`
		);
	};

	return formatter;
}
