import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ObBreadcrumbComponent} from '../breadcrumb/breadcrumb.component';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {obliqueProviders} from '../utilities';
import {ObBreadcrumbConfig, ObTBreadcrumbConfig, defaultBreadcrumbConfig} from './breadcrumb.model';

export {ObBreadcrumbConfig, ObTBreadcrumbConfig} from './breadcrumb.model';
export {ObBreadcrumbComponent} from './breadcrumb.component';

@NgModule({
	declarations: [ObBreadcrumbComponent],
	imports: [CommonModule, MatIconModule, MatTooltipModule, RouterModule, TranslateModule],
	providers: obliqueProviders(),
	exports: [ObBreadcrumbComponent]
})
export class ObBreadcrumbModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObBreadcrumbModule);
	}

	static forRoot(config?: ObBreadcrumbConfig): ModuleWithProviders<ObBreadcrumbModule> {
		return {
			ngModule: ObBreadcrumbModule,
			providers: [{provide: ObTBreadcrumbConfig, useValue: {...defaultBreadcrumbConfig, ...config}}]
		};
	}
}
