import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import 'hammerjs';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
// Application resources:
import {AppModule} from './app/app.module';

if (environment.production) {
	enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
