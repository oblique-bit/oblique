import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	ViewEncapsulation,
	computed,
	inject,
	input,
	output,
} from '@angular/core';
import {ObMasterLayoutNavigationItemDirective} from '../master-layout-navigation-item.directive';
import {IsActiveMatchOptions} from '@angular/router';
import {ObNavigationLink} from '../navigation-link.model';

@Component({
	selector: 'ob-master-layout-navigation-sub-menu-item',
	standalone: false,
	templateUrl: './master-layout-navigation-sub-menu-item.component.html',
	styleUrls: ['./master-layout-navigation-sub-menu-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class.column]': 'column()',
		'[class.ob-has-keyboard-focused-child]': 'hasFocusedChild',
		class: 'ob-master-layout-navigation-sub-menu-item',
	},
})
export class ObMasterLayoutNavigationSubMenuItemComponent {
	readonly child = input<ObNavigationLink>(new ObNavigationLink());
	readonly currentParent = input<ObNavigationLink>(new ObNavigationLink());
	readonly link = input<ObNavigationLink>(new ObNavigationLink());
	readonly activeClass = input('');
	readonly activeLinks = input<ReadonlySet<ObNavigationLink>>(new Set());
	readonly hideExternalLinks = input(true);
	readonly obMasterLayoutNavigationItem = input<ObMasterLayoutNavigationItemDirective>();
	readonly routerLinkActiveOptions = input<IsActiveMatchOptions>();
	readonly routerLinkBase = input<string>();
	readonly showChildren = input(true);

	hasFocusedChild = false;
	readonly column = computed(
		() =>
			this.doesChildMatchCurrentParent(this.child(), this.currentParent()) ||
			this.doAnyDescendantsMatchCurrentParent(this.child(), this.currentParent())
	);
	readonly changeCurrentParent = output<ObNavigationLink>();

	private readonly el = inject(ElementRef);

	goToChildren(child: ObNavigationLink): void {
		this.changeCurrentParent.emit(child);
	}

	toggleFocus(childId: string): void {
		const focusedEl = this.el.nativeElement.querySelector(`#${childId}`);
		this.hasFocusedChild = focusedEl.classList.contains('cdk-keyboard-focused');
	}

	private doAnyDescendantsMatchCurrentParent(child: ObNavigationLink, currentParent: ObNavigationLink): boolean {
		return (
			child.children
				?.map(grandchild => this.doesChildMatchCurrentParent(grandchild, currentParent))
				.reduce((previous, current) => previous || current) ||
			child.children
				?.map(grandchild => this.doAnyDescendantsMatchCurrentParent(grandchild, currentParent))
				.reduce((previous, current) => previous || current)
		);
	}

	private doesChildMatchCurrentParent(child: ObNavigationLink, currentParent: ObNavigationLink): boolean {
		return currentParent.id === child.id;
	}
}
