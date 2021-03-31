import {ModuleWithProviders, NgModule} from '@angular/core';
import {ObMockIconService} from './mock-icon.service';
import {ObIconModule, ObIconsConfig} from '../icon.module';

export {ObMockIconService} from './mock-icon.service';

@NgModule({
	providers: [{provide: ObMockIconService, useClass: ObMockIconService}]
})
export class ObMockIconModule {
	static forRoot(config?: ObIconsConfig): ModuleWithProviders<ObIconModule> {
		return {
			ngModule: ObIconModule
		};
	}
}
