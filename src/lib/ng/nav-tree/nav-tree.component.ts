import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, RouterLinkActive} from '@angular/router';
import {Unsubscribable} from '../unsubscribe';
import {NavTreeItemModel} from './nav-tree-item.model';
import {takeUntil} from 'rxjs/operators';

@Component({
	selector: 'or-nav-tree',
	exportAs: 'orNavTree',
	template: `
		<ng-template #itemList let-items let-parentExpanded="parentExpanded">
			<ng-template ngFor [ngForOf]="items" let-item>
				<li *ngIf="visible(item)"
					class="nav-item open"
					role="presentation"
					(or.navTree.item.toggleCollapsed)="item.collapsed = !item.collapsed"
					[attr.id]="item.id ? (prefix ? prefix + '-' : '') + item.id : null"
					[class.disabled]="item.disabled === true || null"
				>
					<a class="nav-link" role="treeitem" aria-selected="false"
					   [routerLink]="item.routes"
					   #rla="routerLinkActive" routerLinkActive [routerLinkActiveOptions]="rlaOptions"
					   [queryParams]="item.queryParams" [fragment]="item.fragment"
					   (click)="item.collapsed = !item.collapsed"
					   [class.collapsed]="item.collapsed"
					   [class.active]="isLinkActive(rla, item)"
					   [attr.data-toggle]="item.items && !filterPattern ? 'collapse' : null"
					   [attr.disabled]="item.disabled === true || null"
					   [attr.aria-controls]="item.items ? itemKey(item) : null">
						<span [innerHTML]="labelFormatter(item, filterPattern)"></span>
					</a>
					<div id="#{{itemKey(item)}}" class="collapse show"
						 *ngIf="item.items" [ngbCollapse]="item.collapsed">
						<ul class="nav nav-tree"
							[ngClass]="variant"
							[class.expanded]="parentExpanded && !item.collapsed"
							[class.disabled]="item.disabled === true || null"
							role="tree"
						>
							<ng-container *ngTemplateOutlet="itemList; context:{ $implicit: item.items, parentExpanded: parentExpanded && !item.collapsed}">
							</ng-container>
						</ul>
					</div>
				</li>
			</ng-template>
		</ng-template>
		<ul #root class="nav nav-tree expanded" role="tree" [ngClass]="variant">
			<ng-content></ng-content>
			<ng-container *ngTemplateOutlet="itemList; context:{ $implicit: items, parentExpanded: true }"></ng-container>
		</ul>
	`,
	// Ensure CSS styles are added to global styles as search pattern highlighting is done at runtime:
	// (see also: https://angular.io/docs/ts/latest/guide/component-styles.html#!#view-encapsulation)
	encapsulation: ViewEncapsulation.None,
	styles: [`
		.nav-tree-pattern-highlight {
			font-weight: bold;
			text-decoration: underline;
		}
	`]
})
export class NavTreeComponent extends Unsubscribable {

	public static DEFAULTS = {
		VARIANT: 'nav-bordered nav-hover',
		HIGHLIGHT: 'nav-tree-pattern-highlight',
		LABEL_FORMATTER: defaultLabelFormatterFactory
	};

	activeFragment: string; // TODO: remove when https://github.com/angular/angular/issues/13205

	@Input()
	items: Array<NavTreeItemModel>;

	@Input()
	prefix = 'nav-tree';

	@Input()
	filterPattern: string;

	@Input()
	labelFormatter: (item: NavTreeItemModel, filterPattern) => string = NavTreeComponent.DEFAULTS.LABEL_FORMATTER();

	@Input()
	variant = NavTreeComponent.DEFAULTS.VARIANT;

	@Input()
	pathPrefix: string;

	@Input()
	rlaOptions: any = {
		exact: true
	};

	// TODO: remove when https://github.com/angular/angular/issues/13205
	constructor(private readonly route: ActivatedRoute) {
		super();
		this.route.fragment
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((fragment) => {
				this.activeFragment = fragment;
			});
	}

	@Input()
	patternMatcher(item: NavTreeItemModel, pattern: string): boolean {
		const match = new RegExp(pattern, 'gi').test(item.label);
		const childMatch = (item.items || []).some((subItem) => {
			const subMatch = this.patternMatcher(subItem, pattern);
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
		return this.prefix + '-' + item.id;
	}

	// TODO: remove when https://github.com/angular/angular/issues/13205
	isLinkActive(rla: RouterLinkActive, item: NavTreeItemModel) {
		const isLinkActive = rla.isActive;
		return item.fragment
			? isLinkActive && this.activeFragment === item.fragment
			: isLinkActive;
	}

	changeCollapsed(items: NavTreeItemModel[], collapsed: boolean, all: boolean = false): void {
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
export function defaultLabelFormatterFactory() {
	// noinspection UnnecessaryLocalVariableJS because this will result in a runtime error
	const formatter = (item: NavTreeItemModel, filterPattern: string) => {
		return !filterPattern ? item.label : item.label.replace(
			new RegExp(filterPattern, 'ig'),
			(text) => {
				return `<span class="${NavTreeComponent.DEFAULTS.HIGHLIGHT}">${text}</span>`;
			}
		);
	};
	return formatter;
}
