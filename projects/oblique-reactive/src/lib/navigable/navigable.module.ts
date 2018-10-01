import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigableDirective} from './navigable.directive';
import {NavigableGroupComponent} from './navigable-group.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [NavigableDirective, NavigableGroupComponent],
	exports: [NavigableDirective, NavigableGroupComponent]
})
export class NavigableModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: NavigableModule
		};
	}
}
