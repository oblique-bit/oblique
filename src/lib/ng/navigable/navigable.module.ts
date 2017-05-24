import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigableDirective} from './navigable.directive';
import {NavigableGroupDirective} from './navigable-group.directive';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [NavigableDirective, NavigableGroupDirective],
	exports: [NavigableDirective, NavigableGroupDirective]
})
export class NavigableModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: NavigableModule
		};
	}
}
