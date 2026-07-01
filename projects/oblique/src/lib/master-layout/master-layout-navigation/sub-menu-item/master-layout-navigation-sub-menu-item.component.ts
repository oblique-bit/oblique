import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Input,
	OnChanges,
	ViewEncapsulation,
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
	changeDetection: ChangeDetectionStrategy.Eager,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class.column]': 'column',
		'[class.ob-has-keyboard-focused-child]': 'hasFocusedChild',
		class: 'ob-master-layout-navigation-sub-menu-item',
	},
})
export class ObMasterLayoutNavigationSubMenuItemComponent implements OnChanges {
	@Input() column = false;
	hasFocusedChild = false;
	readonly activeClass = input('');
	@Input() child: ObNavigationLink = new ObNavigationLink();
	@Input() currentParent: ObNavigationLink = new ObNavigationLink();
	readonly hideExternalLinks = input(true);
	@Input() link: ObNavigationLink = new ObNavigationLink();
	readonly obMasterLayoutNavigationItem = input<ObMasterLayoutNavigationItemDirective>(undefined);
	readonly routerLinkActiveOptions = input<IsActiveMatchOptions>(undefined);
	readonly routerLinkBase = input<string>(undefined);
	readonly showChildren = input(true);
	readonly changeCurrentParent = output<ObNavigationLink>();

	private readonly el = inject(ElementRef);

	ngOnChanges(): void {
		this.column =
			this.doesChildMatchCurrentParent(this.child, this.currentParent) ||
			this.doAnyDescendantsMatchCurrentParent(this.child, this.currentParent);
	}

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
