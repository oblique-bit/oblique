import {AfterViewInit, ContentChild, ContentChildren, Directive, EventEmitter, HostBinding, Output, QueryList} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../unsubscribe';
import {MasterLayoutNavigationToggleDirective} from './master-layout-navigation-toggle.directive';
import {MasterLayoutNavigationMenuDirective} from './master-layout-navigation-menu.directive';
import {MasterLayoutService} from './master-layout.service';


@Directive({
	selector: '[orMasterLayoutNavigationItem]',
	exportAs: 'orMasterLayoutNavigationItem'
})
export class MasterLayoutNavigationItemDirective extends Unsubscribable implements AfterViewInit {

	@HostBinding('class.show')
	public show = false;

	@Output()
	onClose = new EventEmitter<void>();

	@ContentChildren(MasterLayoutNavigationToggleDirective, {descendants: true})
	$toggles: QueryList<MasterLayoutNavigationToggleDirective>;

	@ContentChild(MasterLayoutNavigationMenuDirective)
	$menu: MasterLayoutNavigationMenuDirective;

	@ContentChildren(MasterLayoutNavigationItemDirective, {descendants: true})
	$items: QueryList<MasterLayoutNavigationItemDirective>;

	constructor(private readonly masterLayout: MasterLayoutService) {
		super();
	}

	ngAfterViewInit() {
		this.$toggles.forEach(($toggle) => {
			$toggle.onToggle
				.pipe(takeUntil(this.unsubscribe))
				.subscribe(($event: any) => {
					if (!$event.prevented) {
						if (this.$menu) {
							if (this.show) {
								this.close();
							} else {
								this.open();
							}
						} else {
							// Final toggle, let's close all parent menus:
							this.onClose.emit();
							this.masterLayout.menuCollapsed = true;
						}
						$event.prevented = true;
					}
				});
		});

		this.$items.forEach(($item) => {
			$item.onClose
				.pipe(takeUntil(this.unsubscribe))
				.subscribe(() => {
					this.close();
				});
		});
	}

	open() {
		this.show = true;

		if (this.$menu) {
			this.$menu.show();
		}
	}

	close() {
		this.show = false;

		if (this.$menu) {
			this.$menu.hide();
		}
	}
}
