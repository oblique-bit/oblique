import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {ObIconService} from './icon.service';
import {ObIconConfig, ObTIconConfig, defaultIconConfig, iconFactory} from './icon.model';

export {ObIconService} from './icon.service';
export {ObIconConfig, ObTIconConfig, ObEIcon} from './icon.model';

@NgModule({
	imports: [CommonModule, MatIconModule]
})
/**
 * @deprecated with Oblique 13.0.0. Use `provideObliqueConfiguration` instead
 */
export class ObIconModule {
	static forRoot(config: ObIconConfig = {}): ModuleWithProviders<ObIconModule> {
		return {
			ngModule: ObIconModule,
			providers: [
				{provide: ObTIconConfig, useValue: {...defaultIconConfig, ...config}},
				{
					provide: APP_INITIALIZER,
					multi: true,
					useFactory: iconFactory,
					deps: [ObIconService]
				}
			]
		};
	}
}
