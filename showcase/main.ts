import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';

// Project resources:
import * as ProjectConfig from '../project.conf.js';

// Oblique resources:
import {SpinnerComponent, TopControlComponent, BrandingAppTitleComponent} from '../src';

// Application resources:
import {AppModule, BOOTSTRAP_COMPONENTS_TOKEN} from './app/app.module';
import {AppComponent} from './app/app.component';
import {LayoutControlsComponent} from './app/layout/controls/controls.component';
import {LayoutNavigationComponent} from './app/layout/navigation/navigation.component';

if (environment.production) {
	enableProdMode();
}

const components = [
	{type: AppComponent},
	{type: BrandingAppTitleComponent},
	{type: SpinnerComponent},
	{type: TopControlComponent},
	{type: LayoutControlsComponent},
	{type: LayoutNavigationComponent}
];

platformBrowserDynamic([
	{provide: BOOTSTRAP_COMPONENTS_TOKEN, useValue: components},
	{provide: 'ObliqueReactive.CONFIG', useValue: ProjectConfig.app}
]).bootstrapModule(AppModule);
