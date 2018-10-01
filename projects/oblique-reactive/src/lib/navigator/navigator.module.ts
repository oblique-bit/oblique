import {NgModule, ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NavigatorComponent} from './navigator.component';

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

