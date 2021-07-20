import {Directive, EventEmitter, Output, QueryList} from '@angular/core';
import {ObMasterLayoutNavigationItemDirective, ObMasterLayoutNavigationMenuDirective, ObMasterLayoutNavigationToggleDirective} from '../master-layout.module';

@Directive({
	selector: '[obMasterLayoutNavigationItem]',
	exportAs: 'obMasterLayoutNavigationItem'
})
export class ObMockMasterLayoutNavigationItemDirective {
	show = false;
	@Output() onClose = new EventEmitter<void>();
	$toggles: QueryList<ObMasterLayoutNavigationToggleDirective>;
	$menu: ObMasterLayoutNavigationMenuDirective;
	$items: QueryList<ObMasterLayoutNavigationItemDirective>;

	open(): void {}

	close(): void {}

	onClick(targetElement?): void {}
}
