import {ContentChildren, Directive, HostListener, QueryList} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Unsubscribable} from '../unsubscribe';
import {MasterLayoutHeaderService} from './master-layout-header.service';
import {MasterLayoutNavigationItemDirective} from './master-layout-navigation-item.directive';

/**
 * FIXME: MasterLayoutNavigation* directives need more design thinking.
 * @deprecated since version 2.1.0. Will be deleted in version 3.0.0. Use MasterLayoutComponent & MasterLayoutService instead
 */
@Directive({
	selector: '[orMasterLayoutNavigation]',
	exportAs: 'orMasterLayoutNavigation'
})
export class MasterLayoutNavigationDirective extends Unsubscribable {

	@ContentChildren(MasterLayoutNavigationItemDirective, {descendants: true})
	$items: QueryList<MasterLayoutNavigationItemDirective>;

	constructor(private readonly headerService: MasterLayoutHeaderService) {
		super();
		console.warn('@deprecated since version 2.1.0. Will be deleted in version 3.0.0. Use MasterLayoutComponent & MasterLayoutService instead');
		// Subscribe to header changes:
		this.headerService.openChange
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((open) => {
				if (!open) {
					// Ensure we close all open navigation items:
					this.$items.forEach(($item) => {
						$item.close();
					});
				}
			});
	}

	@HostListener('window:click', ['$event.target'])
	private windowClick(target: HTMLElement) {
		this.$items.forEach(($item) => {
			// Handle clicks outside current navigation item:
			if (!$item.elementRef.nativeElement.contains(target)) {
				$item.close();
			}
		});
	}
}
