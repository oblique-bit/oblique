import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
// Application resources:
import {AppModule} from './app/app.module';

if (environment.production) {
	enableProdMode();
}

void platformBrowserDynamic().bootstrapModule(AppModule);
