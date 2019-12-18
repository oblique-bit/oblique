import {NgModule} from '@angular/core';
import {ThemeService} from '../theme.service';
import {MockThemeService} from './mock-theme.service';

export {MockThemeService} from './mock-theme.service';

@NgModule({
	providers: [
		{provide: ThemeService, useClass: MockThemeService}]
})
export class MockThemeModule {
}
