import {NgModule, ModuleWithProviders} from '@angular/core';
import {NavigatorComponent} from './navigator.component';
import {RouterModule} from '@angular/router';

@NgModule({
	imports: [
		RouterModule
	],
	declarations: [
		NavigatorComponent
	],
	exports: [
		NavigatorComponent
	]
})
export class NavigatorModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: NavigatorModule
		};
	}
}

