import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ViewEncapsulation,
	computed,
	inject,
	input,
	model,
	signal,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, RouterLink, RouterLinkActive, RouterModule} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

import {NgTemplateOutlet} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ObLocalizePipe} from '../router/ob-localize.pipe';
import {ObNavTreeItemModel} from './nav-tree-item.model';

@Component({
	selector: 'ob-nav-tree',
	imports: [
		RouterLinkActive,
		RouterLink,
		MatIconModule,
		NgTemplateOutlet,
		FormsModule,
		MatIconModule,
		MatInputModule,
		RouterModule,
		TranslatePipe,
		ObLocalizePipe,
	],
	templateUrl: './nav-tree.component.html',
	styleUrls: ['./nav-tree.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'obNavTree',
})
export class ObNavTreeComponent {
	static DEFAULTS = {
		HIGHLIGHT: 'ob-pattern-highlight',
		LABEL_FORMATTER: defaultLabelFormatterFactory,
	};

	readonly formatter = computed<(item: ObNavTreeItemModel, filterPattern?: string) => string>(
		() => this.labelFormatter() ?? this.defaultFormatter
	);
	readonly activeFragment = signal<string | undefined>(undefined); // TODO: remove when https://github.com/angular/angular/issues/13205
	readonly items = input<ObNavTreeItemModel[]>([]);
	readonly prefix = input('nav-tree');
	readonly hasFilter = input(false);
	readonly filterPattern = model<string>();
	readonly labelFormatter = input<(item: ObNavTreeItemModel, filterPattern?: string) => string>();
	readonly treeAriaLabelledBy = input<string>();
	readonly treeAriaLabel = input<string>();
	readonly patternMatcher = input<(item: ObNavTreeItemModel, pattern?: string) => boolean>();
	private readonly changeDetector = inject(ChangeDetectorRef);
	private readonly route = inject(ActivatedRoute);
	private readonly translate = inject(TranslateService);
	private readonly defaultFormatter = ObNavTreeComponent.DEFAULTS.LABEL_FORMATTER(this.translate);
	private readonly defaultPatternMatcher = defaultPatternMatcherFactory(this.translate);
	private readonly effectivePatternMatcher = computed(() => this.patternMatcher() ?? this.defaultPatternMatcher);

	// TODO: remove when https://github.com/angular/angular/issues/13205
	constructor() {
		this.route.fragment.pipe(takeUntilDestroyed()).subscribe(fragment => {
			this.activeFragment.set(fragment ?? undefined);
		});
	}

	visible(item: ObNavTreeItemModel): boolean {
		return !this.filterPattern() || this.effectivePatternMatcher()(item, this.filterPattern());
	}

	itemKey(item: ObNavTreeItemModel): string {
		return `${this.prefix()}-${item.id}`;
	}

	// TODO: remove when https://github.com/angular/angular/issues/13205
	isLinkActive(rla: RouterLinkActive, item: ObNavTreeItemModel): boolean {
		const isLinkActive = rla.isActive;
		return item.fragment ? isLinkActive && this.activeFragment() === item.fragment : isLinkActive;
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
		this.changeCollapsed(this.items(), true, true);
		this.changeDetector.markForCheck();
	}

	public expandAll(): void {
		this.changeCollapsed(this.items(), false, true);
		this.changeDetector.markForCheck();
	}
}

export function defaultPatternMatcherFactory(
	translate: TranslateService
): (item: ObNavTreeItemModel, pattern?: string) => boolean {
	const matcher = (item: ObNavTreeItemModel, pattern = ''): boolean => {
		const text = pattern.replace(/[.*+?^@${}()|[\]\\]/g, '\\$&');
		const label = translate.instant(item.label, item.labelParams);
		const match = new RegExp(text, 'gi').test(label);
		const childMatch = (item.items || []).some(subItem => {
			const subMatch = matcher(subItem, text.replace(/\\/g, ''));
			if (subMatch) {
				// Ensure parent item is not collapsed:
				item.collapsed = false;
			}
			return subMatch;
		});
		return match || childMatch;
	};
	return matcher;
}

export function defaultLabelFormatterFactory(
	translate: TranslateService
): (item: ObNavTreeItemModel, filterPattern?: string) => string {
	// noinspection UnnecessaryLocalVariableJS because this will result in a build error
	const formatter = (item: ObNavTreeItemModel, filterPattern?: string): string => {
		const pattern = (filterPattern || '').replace(/[.*+?^@${}()|[\]\\]/g, '\\$&');
		const label: string = translate.instant(item.label, item.labelParams);
		return pattern
			? label.replace(
					new RegExp(pattern, 'ig'),
					text => `<span class="${ObNavTreeComponent.DEFAULTS.HIGHLIGHT}">${text}</span>`
				)
			: label;
	};

	return formatter;
}
