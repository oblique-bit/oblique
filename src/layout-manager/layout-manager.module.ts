import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {LayoutManagerService} from './layout-manager.service';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule
	]
})
export class LayoutManagerModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: LayoutManagerModule,
			providers: [
				LayoutManagerService
			]
		};
	}
}
