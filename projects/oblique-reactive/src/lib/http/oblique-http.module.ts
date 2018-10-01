import {NgModule, ModuleWithProviders} from '@angular/core';
import {ObliqueHttpInterceptorConfig} from './oblique-http-interceptor.config';
import {ObliqueHttpInterceptor} from './oblique-http-interceptor';

@NgModule({
	imports: [
	],
	declarations: [
	],
	exports: [
	]
})
export class ObliqueHttpModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: ObliqueHttpModule,
			providers: [
				ObliqueHttpInterceptor,
				ObliqueHttpInterceptorConfig
			]
		};
	}
}
