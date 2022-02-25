import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
// Application resources:
import {AppModule} from './app/app.module';
import {OB_PROJECT_INFO} from '../projects/oblique/src/lib/telemetry/telemetry.service';
import packageInfo from '../package.json';

if (environment.production) {
	enableProdMode();
}

void platformBrowserDynamic([
	{provide: OB_PROJECT_INFO, useValue: {name: packageInfo.name, version: packageInfo.version, title: packageInfo.title, homePage: packageInfo.homepage}}
]).bootstrapModule(AppModule);
