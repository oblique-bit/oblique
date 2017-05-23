import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrandingAppTitleComponent} from './app-title/app-title.component';
import {RouterModule} from '@angular/router';

@NgModule({
	imports: [
		CommonModule,
		RouterModule
	],
	declarations: [
		BrandingAppTitleComponent
	],
	exports: [
		BrandingAppTitleComponent
	]
})
export class BrandingModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: BrandingModule
		};
	}
}
