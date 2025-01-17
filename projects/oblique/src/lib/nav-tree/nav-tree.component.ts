import {Component, Input, OnDestroy, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive, RouterModule} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';

import {NgClass, NgFor, NgIf, NgTemplateOutlet} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {Subject} from 'rxjs';
import {ObNavTreeItemModel} from './nav-tree-item.model';

@Component({
	selector: 'ob-nav-tree',
	exportAs: 'obNavTree',
	templateUrl: './nav-tree.component.html',
	styleUrls: ['./nav-tree.component.scss'],
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgFor,
		NgIf,
		RouterLinkActive,
		RouterLink,
		MatIconModule,
		NgClass,
		NgTemplateOutlet,
		FormsModule,
		MatIconModule,
		MatInputModule,
		RouterModule,
		TranslateModule
	]
})
export class ObNavTreeComponent implements OnDestroy {
	static DEFAULTS = {
		HIGHLIGHT: 'ob-pattern-highlight',
		LABEL_FORMATTER: defaultLabelFormatterFactory
	};

	activeFragment: string; // TODO: remove when https://github.com/angular/angular/issues/13205
	@Input() items: ObNavTreeItemModel[] = [];
	@Input() prefix = 'nav-tree';
	@Input() hasFilter = false;
	@Input() filterPattern: string;
	@Input() labelFormatter: (item: ObNavTreeItemModel, filterPattern?: string) => string = ObNavTreeComponent.DEFAULTS.LABEL_FORMATTER(
		this.translate
	);
	@Input() treeAriaLabelledBy: string;
	@Input() treeAriaLabel: string;
	private readonly unsubscribe = new Subject<void>();

	// TODO: remove when https://github.com/angular/angular/issues/13205
	constructor(
		private readonly route: ActivatedRoute,
		private readonly translate: TranslateService
	) {
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
		const text = pattern.replace(/[.*+?^@${}()|[\]\\]/g, '\\$&');
		const label = this.translate.instant(item.label, item.labelParams);
		const match = new RegExp(text, 'gi').test(label);
		const childMatch = (item.items || []).some(subItem => {
			const subMatch = this.patternMatcher(subItem, text.replace(/\\/g, ''));
			if (subMatch) {
				// Ensure parent item is not collapsed:
				item.collapsed = false;
			}
			return subMatch;
		});
		return match || childMatch;
	}

	visible(item: ObNavTreeItemModel): boolean {
		return !this.filterPattern || this.patternMatcher(item, this.filterPattern);
	}

	itemKey(item: ObNavTreeItemModel): string {
		return `${this.prefix}-${item.id}`;
	}

	// TODO: remove when https://github.com/angular/angular/issues/13205
	isLinkActive(rla: RouterLinkActive, item: ObNavTreeItemModel): boolean {
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
	public collapseAll(): void {
		this.changeCollapsed(this.items, true, true);
	}

	public expandAll(): void {
		this.changeCollapsed(this.items, false, true);
	}
}

export function defaultLabelFormatterFactory(translate: TranslateService): (item: ObNavTreeItemModel, filterPattern: string) => string {
	// noinspection UnnecessaryLocalVariableJS because this will result in a build error
	const formatter = (item: ObNavTreeItemModel, filterPattern: string): string => {
		const pattern = (filterPattern || '').replace(/[.*+?^@${}()|[\]\\]/g, '\\$&');
		const label: string = translate.instant(item.label, item.labelParams);
		return pattern
			? label.replace(new RegExp(pattern, 'ig'), text => `<span class="${ObNavTreeComponent.DEFAULTS.HIGHLIGHT}">${text}</span>`)
			: label;
	};

	return formatter;
}
