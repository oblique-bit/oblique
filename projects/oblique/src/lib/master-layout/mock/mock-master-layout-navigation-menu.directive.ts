import {Directive, EventEmitter, Output, QueryList} from '@angular/core';
import {MasterLayoutNavigationMenuDirective} from '../master-layout.module';

@Directive({
	selector: '[orMasterLayoutNavigationMenu]',
	exportAs: 'orMasterLayoutNavigationMenu'
})
export class MockMasterLayoutNavigationMenuDirective {
	@Output() onShow = new EventEmitter<boolean>();
	$menus: QueryList<MasterLayoutNavigationMenuDirective>;

	show(): void {
	}

	hide(): void {
	}
}
