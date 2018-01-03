import {ContentChildren, Directive, HostListener, QueryList} from '@angular/core';
import {MasterLayoutHeaderService} from './master-layout-header.service';
import {MasterLayoutNavigationItemDirective} from './master-layout-navigation-item.directive';

/**
 * FIXME: MasterLayoutNavigation* directives need more design thinking.
 */
@Directive({
	selector: '[orMasterLayoutNavigation]',
	exportAs: 'orMasterLayoutNavigation'
})
export class MasterLayoutNavigationDirective {

	@ContentChildren(MasterLayoutNavigationItemDirective, {descendants: true})
	$items: QueryList<MasterLayoutNavigationItemDirective>;

	constructor(private headerService: MasterLayoutHeaderService) {
		// Subscribe to header changes:
		this.headerService.openChange.subscribe((open) => {
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
