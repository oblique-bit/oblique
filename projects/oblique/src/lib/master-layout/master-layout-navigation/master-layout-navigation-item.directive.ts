import {AfterViewInit, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Output, QueryList} from '@angular/core';
import {filter, takeUntil} from 'rxjs/operators';

import {ObUnsubscribable} from '../../unsubscribe.class';
import {ObMasterLayoutNavigationToggleDirective} from './master-layout-navigation-toggle.directive';
import {ObMasterLayoutNavigationMenuDirective} from './master-layout-navigation-menu.directive';
import {ObEMasterLayoutEventValues} from '../master-layout.utility';
import {ObMasterLayoutComponentService} from '../master-layout/master-layout.component.service';


@Directive({
	selector: '[obMasterLayoutNavigationItem]',
	exportAs: 'obMasterLayoutNavigationItem'
})
export class ObMasterLayoutNavigationItemDirective extends ObUnsubscribable implements AfterViewInit {
	@HostBinding('class.show')  public show = false;
	@Output() onClose = new EventEmitter<void>();
	@ContentChildren(ObMasterLayoutNavigationToggleDirective, {descendants: true}) $toggles: QueryList<ObMasterLayoutNavigationToggleDirective>;
	@ContentChild(ObMasterLayoutNavigationMenuDirective) $menu: ObMasterLayoutNavigationMenuDirective;
	@ContentChildren(ObMasterLayoutNavigationItemDirective, {descendants: true}) $items: QueryList<ObMasterLayoutNavigationItemDirective>;

	constructor(private readonly masterLayout: ObMasterLayoutComponentService, private readonly element: ElementRef) {
		super();
	}

	ngAfterViewInit() {
		this.$toggles.forEach(($toggle) => {
			$toggle.onToggle
				.pipe(takeUntil(this.unsubscribe), filter(($event: any) => !$event.prevented))
				.subscribe(($event: any) => {
					if (this.$menu) {
						this.show ? this.close() : this.open();
					} else {
						// Final toggle, let's close all parent menus:
						this.onClose.emit();
						this.masterLayout.isMenuOpened = false;
					}
					$event.prevented = true;
				});
		});

		this.masterLayout.configEvents
			.pipe(filter(evt => evt.name === ObEMasterLayoutEventValues.COLLAPSE && evt.value)).subscribe(() => this.close());

		this.$items.forEach(($item) => {
			$item.onClose.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.close());
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

	@HostListener('document:click', ['$event.target'])
	@HostListener('document:keyup.escape')
	onClick(targetElement?) {
		if (this.show && !this.element.nativeElement.contains(targetElement)) {
			this.close();
		}
	}
}
