import {Directive, EventEmitter, Output, QueryList} from '@angular/core';
import {
	ObMasterLayoutNavigationItemDirective,
	ObMasterLayoutNavigationMenuDirective,
	ObMasterLayoutNavigationToggleDirective
} from '../master-layout.module';

@Directive({
	selector: '[obMasterLayoutNavigationItem]',
	exportAs: 'obMasterLayoutNavigationItem'
})
export class ObMockMasterLayoutNavigationItemDirective {
	show = false;
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() readonly onClose = new EventEmitter<void>();
	$toggles: QueryList<ObMasterLayoutNavigationToggleDirective>;
	$menu: ObMasterLayoutNavigationMenuDirective;
	$items: QueryList<ObMasterLayoutNavigationItemDirective>;

	open(): void {}

	close(): void {}

	onClick(targetElement?): void {}
}
