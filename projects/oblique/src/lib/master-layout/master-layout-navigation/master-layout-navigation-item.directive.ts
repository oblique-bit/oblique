import {
	AfterViewInit,
	ContentChild,
	ContentChildren,
	Directive,
	ElementRef,
	EventEmitter,
	HostBinding,
	OnDestroy,
	Output,
	QueryList
} from '@angular/core';
import {filter, takeUntil} from 'rxjs/operators';

import {ObMasterLayoutNavigationToggleDirective} from './master-layout-navigation-toggle.directive';
import {ObMasterLayoutNavigationMenuDirective} from './master-layout-navigation-menu.directive';
import {ObEMasterLayoutEventValues} from '../master-layout.model';
import {ObMasterLayoutComponentService} from '../master-layout/master-layout.component.service';
import {Subject, merge} from 'rxjs';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {obOutsideFilter} from '../../global-events/outsideFilter';

@Directive({
	selector: '[obMasterLayoutNavigationItem]',
	exportAs: 'obMasterLayoutNavigationItem',
	host: {class: 'ob-master-layout-navigation-item'}
})
export class ObMasterLayoutNavigationItemDirective implements AfterViewInit, OnDestroy {
	@HostBinding('class.ob-expanded') public show = false;
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() readonly onClose = new EventEmitter<void>();
	@Output() readonly toggled = new EventEmitter<boolean>();
	@ContentChildren(ObMasterLayoutNavigationToggleDirective, {descendants: true})
	$toggles: QueryList<ObMasterLayoutNavigationToggleDirective>;
	@ContentChild(ObMasterLayoutNavigationMenuDirective) $menu: ObMasterLayoutNavigationMenuDirective;
	@ContentChildren(ObMasterLayoutNavigationItemDirective, {descendants: true}) $items: QueryList<ObMasterLayoutNavigationItemDirective>;
	private readonly unsubscribe = new Subject<void>();

	constructor(
		private readonly masterLayout: ObMasterLayoutComponentService,
		private readonly element: ElementRef,
		private readonly globalEventsService: ObGlobalEventsService
	) {}

	ngAfterViewInit(): void {
		merge(
			this.globalEventsService.click$.pipe(obOutsideFilter(this.element.nativeElement)),
			this.globalEventsService.keyUp$.pipe(filter(event => event.key === 'Escape'))
		)
			.pipe(
				filter(() => this.show),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => this.onClick(event.target));

		this.manageToggles();
		this.masterLayout.configEvents$
			.pipe(filter(evt => evt.name === ObEMasterLayoutEventValues.IS_MENU_OPENED && evt.value))
			.subscribe(() => this.close());

		this.$items.forEach($item => {
			$item.onClose.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.close());
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	open(): void {
		this.show = true;
		// when a menu item with sub navigation is toggled while another menu item with sub navigation is already opened,
		// the first menu has to be closed before the second one is opened so that the `ob-has-opened-menu` class is correctly set
		// on the navigation's root. This class ensures that menu items on the far right of the screen don't trigger an horizontal
		// scrollbar. As the `close` method is called asynchronously and the `open` one synchronously, `open` will always be
		// called before `close`. Adding `setTimeout` with no delay ensures that `open` is called after `close`.
		setTimeout(() => this.toggled.emit(true));

		if (this.$menu) {
			this.$menu.show();
		}
	}

	close(): void {
		this.show = false;
		this.toggled.emit(false);

		if (this.$menu) {
			this.$menu.hide();
		}
	}

	onClick(targetElement?: EventTarget): void {
		if (this.show && !this.element.nativeElement.contains(targetElement)) {
			this.close();
		}
	}

	private manageToggles(): void {
		this.$toggles.forEach($toggle => {
			$toggle.onToggle
				.pipe(
					takeUntil(this.unsubscribe),
					filter(($event: any) => !$event.prevented)
				)
				.subscribe(($event: any) => {
					if (this.$menu) {
						if (this.show) {
							this.close();
						} else {
							this.open();
						}
					} else {
						// Final toggle, let's close all parent menus:
						this.onClose.emit();
						this.masterLayout.isMenuOpened = false;
					}
					$event.prevented = true;
				});
		});
	}
}
