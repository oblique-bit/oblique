import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';

// Project resources:
import {ProjectConfig} from '../project.conf';

// Application resources:
import {AppModule} from './app/app.module';

if (environment.production) {
	enableProdMode();
}

platformBrowserDynamic([
	{provide: 'ObliqueReactive.CONFIG', useValue: ProjectConfig.app}
]).bootstrapModule(AppModule);
