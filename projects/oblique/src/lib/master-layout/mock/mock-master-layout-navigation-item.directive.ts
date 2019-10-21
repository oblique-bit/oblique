import {Directive, EventEmitter, Output, QueryList} from '@angular/core';
import {MasterLayoutNavigationItemDirective, MasterLayoutNavigationMenuDirective, MasterLayoutNavigationToggleDirective} from '../master-layout.module';

@Directive({
	selector: '[orMasterLayoutNavigationItem]',
	exportAs: 'orMasterLayoutNavigationItem'
})
export class MockMasterLayoutNavigationItemDirective {
	show = false;
	@Output() onClose = new EventEmitter<void>();
	$toggles: QueryList<MasterLayoutNavigationToggleDirective>;
	$menu: MasterLayoutNavigationMenuDirective;
	$items: QueryList<MasterLayoutNavigationItemDirective>;

	open(): void {
	}

	close(): void {
	}

	onClick(targetElement?): void {
	}
}
