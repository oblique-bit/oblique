import {NgModule} from '@angular/core';
import {ObThemeService} from '../theme.service';
import {ObMockThemeService} from './mock-theme.service';

export {ObMockThemeService} from './mock-theme.service';

@NgModule({
	providers: [
		{provide: ObThemeService, useClass: ObMockThemeService}]
})
export class ObMockThemeModule {
}
