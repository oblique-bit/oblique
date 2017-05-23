import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {LayoutManagerService} from './layout-manager.service';
import {Ng2Webstorage} from 'ngx-webstorage';
import {LayoutManagerDirective} from './layout-manager.directive';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		Ng2Webstorage.forRoot({prefix: 'oblique'})
	],
	declarations: [
		LayoutManagerDirective
	],
	exports: [
		LayoutManagerDirective
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
