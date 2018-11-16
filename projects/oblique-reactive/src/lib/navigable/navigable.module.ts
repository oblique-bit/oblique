import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NavigableDirective} from './navigable.directive';
import {NavigableGroupComponent} from './navigable-group.component';

export {NavigableDirective, NavigableOnChangeEvent, NavigableOnMoveEvent, PreventableEvent} from './navigable.directive';
export {NavigableGroupComponent} from './navigable-group.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [NavigableDirective, NavigableGroupComponent],
	exports: [NavigableDirective, NavigableGroupComponent]
})
export class NavigableModule {
}
