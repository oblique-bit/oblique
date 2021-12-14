import {Directive, EventEmitter, Output, QueryList} from '@angular/core';
import {ObMasterLayoutNavigationMenuDirective} from '../master-layout.module';

@Directive({
	selector: '[obMasterLayoutNavigationMenu]',
	exportAs: 'obMasterLayoutNavigationMenu'
})
export class ObMockMasterLayoutNavigationMenuDirective {
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() readonly onShow = new EventEmitter<boolean>();
	$menus: QueryList<ObMasterLayoutNavigationMenuDirective>;

	show(): void {}

	hide(): void {}
}
