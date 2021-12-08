import {ModuleWithProviders, NgModule} from '@angular/core';
import {ObMockIconService} from './mock-icon.service';
import {ObIconConfig, ObIconModule} from '../icon.module';
import {ObMockIconComponent} from './mock-icon.component';

export {ObMockIconService} from './mock-icon.service';
export {ObMockIconComponent} from './mock-icon.component';

@NgModule({
	providers: [{provide: ObMockIconService, useClass: ObMockIconService}],
	declarations: [ObMockIconComponent],
	exports: [ObMockIconComponent]
})
export class ObMockIconModule {
	static forRoot(config?: ObIconConfig): ModuleWithProviders<ObIconModule> {
		return {
			ngModule: ObIconModule
		};
	}
}
