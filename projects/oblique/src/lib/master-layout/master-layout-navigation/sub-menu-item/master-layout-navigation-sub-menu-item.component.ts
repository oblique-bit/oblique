import {Component, EventEmitter, HostBinding, Input, OnChanges, Output, ViewEncapsulation} from '@angular/core';
import {ObMasterLayoutNavigationItemDirective} from '../master-layout-navigation-item.directive';
import {IsActiveMatchOptions} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ObINavigationLink} from '../../master-layout.model';

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
	@Input() child: ObINavigationLink;
	@Input() currentParent = '';
	@Input() link: ObINavigationLink;
	@Input() obMasterLayoutNavigationItem: ObMasterLayoutNavigationItemDirective;
	@Input() routerLinkActiveOptions: IsActiveMatchOptions;
	@Input() routerLinkBase: string;
	@Output() readonly changeCurrentParent: EventEmitter<string> = new EventEmitter<string>();

	constructor(private readonly translateService: TranslateService) {}

	ngOnChanges(): void {
		this.column = this.currentParent === this.getId(this.child.label, this.child.id) || this.doAnyDescendantsMatchCurrentParent(this.child);
	}

	goToChildren(child: ObINavigationLink): void {
		this.changeCurrentParent.emit(this.getId(child.label, child.id));
	}

	forwardCurrentParent(currentParent: string): void {
		this.changeCurrentParent.emit(currentParent);
	}

	private doAnyDescendantsMatchCurrentParent(child: ObINavigationLink): boolean {
		return (
			child.children?.map(kid => this.currentParent === this.getId(kid.label, kid.id)).reduce((previous, current) => previous || current) ||
			child.children?.map(kid => this.doAnyDescendantsMatchCurrentParent(kid)).reduce((previous, current) => previous || current)
		);
	}

	private getId(label: string, id?: string): string {
		return id ?? (label.startsWith('i18n.') ? this.translateService.instant(label) : label);
	}
}
