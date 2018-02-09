import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, RouterLinkActive} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Unsubscribable} from '../unsubscribe';
import {NavTreeItemModel} from './nav-tree-item.model';

@Component({
	selector: 'or-nav-tree',
	exportAs: 'orNavTree',
	template: `
		<ng-template #itemList let-items>
			<ng-template ngFor [ngForOf]="items" let-item>
				<li *ngIf="visible(item)"
					class="nav-item open"
					role="presentation"
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
						<ul class="nav nav-tree" role="tree" [ngClass]="variant">
							<ng-container *ngTemplateOutlet="itemList; context:{ $implicit: item.items }">
							</ng-container>
						</ul>
					</div>
				</li>
			</ng-template>
		</ng-template>
		<ul class="nav nav-tree" role="tree" [ngClass]="variant">
			<ng-content></ng-content>
			<ng-container *ngTemplateOutlet="itemList; context:{ $implicit: items }"></ng-container>
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
	constructor(private route: ActivatedRoute) {
		super();
		this.route.fragment
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((fragment) => {
				this.activeFragment = fragment;
			});
	}

	@Input()
	patternMatcher(item: NavTreeItemModel, pattern: string): boolean {
		let match = new RegExp(pattern, 'gi').test(item.label);
		let childMatch = (item.items || []).some((subItem) => {
			let subMatch = this.patternMatcher(subItem, pattern);
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

	collapse(items: NavTreeItemModel[], all: boolean = false) {
		items
			.filter((item) => item.items)
			.forEach((item: NavTreeItemModel) => {
				item.collapsed = true;
				if (all) {
					this.collapse(item.items, all);
				}
			});
	}

	expand(items: NavTreeItemModel[], all: boolean = false) {
		items
			.filter((item) => item.items)
			.forEach((item: NavTreeItemModel) => {
				item.collapsed = false;
				if (all) {
					this.expand(item.items, all);
				}
			});
	}

	// TODO: remove when https://github.com/angular/angular/issues/13205
	isLinkActive(rla: RouterLinkActive, item: NavTreeItemModel) {
		return rla.isActive && (
			!item.fragment && !this.rlaOptions.exact || this.activeFragment === item.fragment
		);
	}

	// Public API:
	public collapseAll() {
		this.collapse(this.items, true);
	}

	public expandAll() {
		this.expand(this.items, true);
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
