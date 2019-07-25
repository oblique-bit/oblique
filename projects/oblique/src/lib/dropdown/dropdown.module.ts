import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DropdownComponent} from './dropdown.component';

export {DropdownComponent} from './dropdown.component';

@NgModule({
	declarations: [DropdownComponent],
	exports: [DropdownComponent],
	imports: [
		CommonModule
	]
})
export class DropdownModule {
}
