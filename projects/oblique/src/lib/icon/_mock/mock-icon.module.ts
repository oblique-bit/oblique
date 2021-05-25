import {ModuleWithProviders, NgModule} from '@angular/core';
import {ObMockIconService} from './mock-icon.service';
import {ObIconModule, ObIconConfig} from '../icon.module';

export {ObMockIconService} from './mock-icon.service';

@NgModule({
	providers: [{provide: ObMockIconService, useClass: ObMockIconService}]
})
export class ObMockIconModule {
	static forRoot(config?: ObIconConfig): ModuleWithProviders<ObIconModule> {
		return {
			ngModule: ObIconModule
		};
	}
}
