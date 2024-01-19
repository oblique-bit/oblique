import {ModuleWithProviders, NgModule} from '@angular/core';
import {ObMockIconService} from './mock-icon.service';
import {ObIconConfig, ObIconModule} from '../icon.module';
import {ObMockIconComponent} from './mock-icon.component';

export {ObMockIconService} from './mock-icon.service';
export {ObMockIconComponent} from './mock-icon.component';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockIconComponent],
	providers: [{provide: ObMockIconService, useClass: ObMockIconService}],
	exports: [ObMockIconComponent]
})
export class ObMockIconModule {
	static forRoot(config?: ObIconConfig): ModuleWithProviders<ObIconModule> {
		return {
			ngModule: ObIconModule
		};
	}
}
