import {Component, EventEmitter, HostBinding, Input, OnChanges, Output, ViewEncapsulation} from '@angular/core';
import {ObMasterLayoutNavigationItemDirective} from '../master-layout-navigation-item.directive';
import {IsActiveMatchOptions} from '@angular/router';
import {ObNavigationLink} from '../navigation-link.model';

@Component({
	selector: 'ob-master-layout-navigation-sub-menu-item',
	templateUrl: './master-layout-navigation-sub-menu-item.component.html',
	styleUrls: ['./master-layout-navigation-sub-menu-item.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-master-layout-navigation-sub-menu-item'}
})
export class ObMasterLayoutNavigationSubMenuItemComponent implements OnChanges {
	@HostBinding('class.column') @Input() column = false;
	@Input() activeClass = '';
	@Input() child: ObNavigationLink = new ObNavigationLink();
	@Input() currentParent: ObNavigationLink = new ObNavigationLink();
	@Input() hideExternalLinks = true;
	@Input() link: ObNavigationLink = new ObNavigationLink();
	@Input() obMasterLayoutNavigationItem: ObMasterLayoutNavigationItemDirective;
	@Input() routerLinkActiveOptions: IsActiveMatchOptions;
	@Input() routerLinkBase: string;
	@Input() showChildren = true;
	@Output() readonly changeCurrentParent: EventEmitter<ObNavigationLink> = new EventEmitter<ObNavigationLink>();

	ngOnChanges(): void {
		this.column =
			this.doesChildMatchCurrentParent(this.child, this.currentParent) ||
			this.doAnyDescendantsMatchCurrentParent(this.child, this.currentParent);
	}

	goToChildren(child: ObNavigationLink): void {
		this.changeCurrentParent.emit(child);
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
