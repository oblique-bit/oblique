import {ModuleWithProviders, NgModule} from '@angular/core';
import {ObBreadcrumbComponent} from '../breadcrumb/breadcrumb.component';
import {ObBreadcrumbConfig, ObTBreadcrumbConfig, defaultBreadcrumbConfig} from './breadcrumb.model';

export {ObBreadcrumbConfig, ObTBreadcrumbConfig} from './breadcrumb.model';
export {ObBreadcrumbComponent} from './breadcrumb.component';

@NgModule({
	imports: [ObBreadcrumbComponent],
	exports: [ObBreadcrumbComponent],
})
export class ObBreadcrumbModule {
	static forRoot(config?: ObBreadcrumbConfig): ModuleWithProviders<ObBreadcrumbModule> {
		return {
			ngModule: ObBreadcrumbModule,
			providers: [{provide: ObTBreadcrumbConfig, useValue: {...defaultBreadcrumbConfig, ...config}}],
		};
	}
}
