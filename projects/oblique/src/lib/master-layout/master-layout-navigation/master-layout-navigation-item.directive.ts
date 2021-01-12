import {
	AfterViewInit,
	ContentChild,
	ContentChildren,
	Directive,
	ElementRef,
	EventEmitter,
	HostBinding,
	HostListener,
	OnDestroy,
	Output,
	QueryList
} from '@angular/core';
import {filter, takeUntil} from 'rxjs/operators';

import {ObMasterLayoutNavigationToggleDirective} from './master-layout-navigation-toggle.directive';
import {ObMasterLayoutNavigationMenuDirective} from './master-layout-navigation-menu.directive';
import {ObEMasterLayoutEventValues} from '../master-layout.datatypes';
import {ObMasterLayoutComponentService} from '../master-layout/master-layout.component.service';
import {Subject} from 'rxjs';

@Directive({
	selector: '[obMasterLayoutNavigationItem]',
	exportAs: 'obMasterLayoutNavigationItem',
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-master-layout-navigation-item'}
})
export class ObMasterLayoutNavigationItemDirective implements AfterViewInit, OnDestroy {
	@HostBinding('class.ob-expanded') public show = false;
	@Output() onClose = new EventEmitter<void>();
	@ContentChildren(ObMasterLayoutNavigationToggleDirective, {descendants: true}) $toggles: QueryList<ObMasterLayoutNavigationToggleDirective>;
	@ContentChild(ObMasterLayoutNavigationMenuDirective) $menu: ObMasterLayoutNavigationMenuDirective;
	@ContentChildren(ObMasterLayoutNavigationItemDirective, {descendants: true}) $items: QueryList<ObMasterLayoutNavigationItemDirective>;
	private readonly unsubscribe = new Subject();

	constructor(private readonly masterLayout: ObMasterLayoutComponentService, private readonly element: ElementRef) {}

	ngAfterViewInit() {
		this.$toggles.forEach($toggle => {
			$toggle.onToggle
				.pipe(
					takeUntil(this.unsubscribe),
					filter(($event: any) => !$event.prevented)
				)
				.subscribe(($event: any) => {
					if (this.$menu) {
						// eslint-disable-next-line no-unused-expressions
						this.show ? this.close() : this.open();
					} else {
						// Final toggle, let's close all parent menus:
						this.onClose.emit();
						this.masterLayout.isMenuOpened = false;
					}
					$event.prevented = true;
				});
		});

		this.masterLayout.configEvents.pipe(filter(evt => evt.name === ObEMasterLayoutEventValues.COLLAPSE && evt.value)).subscribe(() => this.close());

		this.$items.forEach($item => {
			$item.onClose.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.close());
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
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
