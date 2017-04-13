import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ObliqueFormGroupDirective} from './form-group.directive';

@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [ObliqueFormGroupDirective],
	exports: [ObliqueFormGroupDirective]
})
export class ObliqueFormGroupModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: ObliqueFormGroupModule
		};
	}
}
