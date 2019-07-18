import {AfterViewInit, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Output, QueryList} from '@angular/core';
import {filter, takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../../unsubscribe.class';
import {MasterLayoutNavigationToggleDirective} from './master-layout-navigation-toggle.directive';
import {MasterLayoutNavigationMenuDirective} from './master-layout-navigation-menu.directive';
import {MasterLayoutEventValues} from '../master-layout.utility';
import {MasterLayoutComponentService} from '../master-layout/master-layout-component.service';


@Directive({
	selector: '[orMasterLayoutNavigationItem]',
	exportAs: 'orMasterLayoutNavigationItem'
})
export class MasterLayoutNavigationItemDirective extends Unsubscribable implements AfterViewInit {
	@HostBinding('class.show')  public show = false;
	@Output() onClose = new EventEmitter<void>();
	@ContentChildren(MasterLayoutNavigationToggleDirective, {descendants: true}) $toggles: QueryList<MasterLayoutNavigationToggleDirective>;
	@ContentChild(MasterLayoutNavigationMenuDirective, {static: false}) $menu: MasterLayoutNavigationMenuDirective;
	@ContentChildren(MasterLayoutNavigationItemDirective, {descendants: true}) $items: QueryList<MasterLayoutNavigationItemDirective>;

	constructor(private readonly masterLayout: MasterLayoutComponentService, private readonly element: ElementRef) {
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
			.pipe(filter(evt => evt.name === MasterLayoutEventValues.COLLAPSE && evt.value)).subscribe(() => this.close());

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
