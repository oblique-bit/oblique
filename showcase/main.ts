import './polyfills.ts';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';

// Oblique resources:
import {SpinnerComponent, TopControlComponent} from '../src';

// Application resources:
import {AppModule, BOOTSTRAP_COMPONENTS_TOKEN} from './app/app.module';
import {AppComponent} from './app/app.component';
import {LayoutControlsComponent} from './app/layout/controls/controls.component';
import {LayoutNavigationComponent} from './app/layout/navigation/navigation.component';

if (environment.production) {
	enableProdMode();
}

const components = [
	{type: AppComponent, selector: "app-root#view"},
	{type: SpinnerComponent, selector: "app-root#spinner"},
	{type: TopControlComponent, selector: "app-root#top-control"},
	{type: LayoutControlsComponent, selector: "app-root#controls"},
	{type: LayoutNavigationComponent, selector: "app-root#navigation"}
];

platformBrowserDynamic([
	{provide: BOOTSTRAP_COMPONENTS_TOKEN, useValue: components}
]).bootstrapModule(AppModule);
