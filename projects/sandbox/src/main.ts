import {platformBrowser} from '@angular/platform-browser';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
import {AppModule} from './app/app.module';

if (environment.production) {
	enableProdMode();
}

void platformBrowser().bootstrapModule(AppModule);
