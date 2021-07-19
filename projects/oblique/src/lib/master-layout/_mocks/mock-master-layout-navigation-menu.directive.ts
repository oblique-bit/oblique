import {Directive, EventEmitter, Output, QueryList} from '@angular/core';
import {ObMasterLayoutNavigationMenuDirective} from '../master-layout.module';

@Directive({
	selector: '[obMasterLayoutNavigationMenu]',
	exportAs: 'obMasterLayoutNavigationMenu'
})
export class ObMockMasterLayoutNavigationMenuDirective {
	@Output() onShow = new EventEmitter<boolean>();
	$menus: QueryList<ObMasterLayoutNavigationMenuDirective>;

	show(): void {}

	hide(): void {}
}
