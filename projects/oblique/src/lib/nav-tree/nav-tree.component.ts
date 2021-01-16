import {Component, Input, OnDestroy, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, RouterLinkActive} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';

import {ObNavTreeItemModel} from './nav-tree-item.model';
import {Subject} from 'rxjs';

@Component({
	selector: 'ob-nav-tree',
	exportAs: 'obNavTree',
	templateUrl: './nav-tree.component.html',
	styleUrls: ['./nav-tree.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ObNavTreeComponent implements OnDestroy {
	static DEFAULTS = {
		VARIANT: 'nav-bordered nav-hover',
		HIGHLIGHT: 'pattern-highlight',
		LABEL_FORMATTER: defaultLabelFormatterFactory
	};

	activeFragment: string; // TODO: remove when https://github.com/angular/angular/issues/13205
	@Input() items: ObNavTreeItemModel[] = [];
	@Input() prefix = 'nav-tree';
	@Input() filterPattern: string;
	@Input() labelFormatter: (item: ObNavTreeItemModel, filterPattern?: string) => string = ObNavTreeComponent.DEFAULTS.LABEL_FORMATTER(this.translate);
	@Input() variant = ObNavTreeComponent.DEFAULTS.VARIANT;
	@Input() activateAncestors = true;
	private readonly unsubscribe = new Subject();

	// TODO: remove when https://github.com/angular/angular/issues/13205
	constructor(private readonly route: ActivatedRoute, private readonly translate: TranslateService) {
		this.route.fragment.pipe(takeUntil(this.unsubscribe)).subscribe(fragment => {
			this.activeFragment = fragment;
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	@Input()
	patternMatcher(item: ObNavTreeItemModel, pattern = ''): boolean {
		pattern = pattern.replace(/[.*+?^@${}()|[\]\\]/g, '\\$&');
		const label = this.translate.instant(item.label, item.labelParams);
		const match = new RegExp(pattern, 'gi').test(label);
		const childMatch = (item.items || []).some(subItem => {
			const subMatch = this.patternMatcher(subItem, pattern.replace(/\\/g, ''));
			if (subMatch) {
				// Ensure parent item is not collapsed:
				item.collapsed = false;
			}
			return subMatch;
		});
		return match || childMatch;
	}

	visible(item: ObNavTreeItemModel) {
		return !this.filterPattern || this.patternMatcher(item, this.filterPattern);
	}

	itemKey(item: ObNavTreeItemModel) {
		return `${this.prefix}-${item.id}`;
	}

	// TODO: remove when https://github.com/angular/angular/issues/13205
	isLinkActive(rla: RouterLinkActive, item: ObNavTreeItemModel) {
		const isLinkActive = rla.isActive;
		return item.fragment ? isLinkActive && this.activeFragment === item.fragment : isLinkActive;
	}

	changeCollapsed(items: ObNavTreeItemModel[], collapsed: boolean, all = false): void {
		items
			.filter(item => item.items)
			.forEach((item: ObNavTreeItemModel) => {
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

export function defaultLabelFormatterFactory(translate: TranslateService) {
	// noinspection UnnecessaryLocalVariableJS because this will result in a build error
	const formatter = (item: ObNavTreeItemModel, filterPattern: string) => {
		filterPattern = (filterPattern || '').replace(/[.*+?^@${}()|[\]\\]/g, '\\$&');
		const label = translate.instant(item.label, item.labelParams);
		return !filterPattern
			? label
			: label.replace(new RegExp(filterPattern, 'ig'), text => `<span class="${ObNavTreeComponent.DEFAULTS.HIGHLIGHT}">${text}</span>`);
	};

	return formatter;
}
