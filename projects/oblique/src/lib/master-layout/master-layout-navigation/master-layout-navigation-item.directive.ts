import {Directive, ElementRef, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {filter, takeUntil} from 'rxjs/operators';

import {Subject, merge} from 'rxjs';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {obOutsideFilter} from '../../global-events/outsideFilter';
import {ObMasterLayoutComponentService} from '../master-layout/master-layout.component.service';
import {ObMasterLayoutNavigationMenuDirective} from './master-layout-navigation-menu.directive';
import {obMasterLayoutNavigationSubMenuFilter} from './masterLayoutNavigationSubMenuFilter';

@Directive({
	selector: '[obMasterLayoutNavigationItem]',
	exportAs: 'obMasterLayoutNavigationItem',
	host: {class: 'ob-master-layout-navigation-item'},
	standalone: false
})
export class ObMasterLayoutNavigationItemDirective implements OnInit, OnDestroy {
	@HostBinding('class.ob-expanded') isExpanded = false;
	private readonly unsubscribe = new Subject<void>();

	constructor(
		private readonly masterLayout: ObMasterLayoutComponentService,
		private readonly element: ElementRef,
		private readonly globalEventsService: ObGlobalEventsService,
		private readonly mainMenu: ObMasterLayoutNavigationMenuDirective
	) {}

	ngOnInit(): void {
		this.monitorForClickOutside();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	toggleSubMenu(): void {
		if (this.isExpanded) {
			this.closeSubMenu();
		} else {
			this.openSubMenu();
		}
	}

	openSubMenu(): void {
		this.isExpanded = true;
		this.mainMenu.menuOpened();
	}

	closeSubMenu(closeMainMenu = true): void {
		this.isExpanded = false;
		this.mainMenu.menuClosed();
		if (closeMainMenu) {
			this.masterLayout.isMenuOpened = false;
		}
	}

	private monitorForClickOutside(): void {
		merge(
			this.globalEventsService.click$.pipe(obOutsideFilter(this.element.nativeElement), obMasterLayoutNavigationSubMenuFilter()),
			this.globalEventsService.keyUp$.pipe(filter(event => event.key === 'Escape'))
		)
			.pipe(
				filter(() => this.isExpanded),
				takeUntil(this.unsubscribe)
			)
			.subscribe(() => this.closeSubMenu());
	}
}
