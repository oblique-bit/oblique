import {provideZoneChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import './register-icons';

bootstrapApplication(AppComponent, {
	...appConfig,
	providers: [provideZoneChangeDetection(), ...appConfig.providers],
}).catch((err: unknown) => console.error(err));
