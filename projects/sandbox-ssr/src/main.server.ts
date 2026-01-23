import {type ApplicationRef, provideZoneChangeDetection} from '@angular/core';
import {type BootstrapContext, bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {config} from './app/app.config.server';

const bootstrap = async (context: BootstrapContext): Promise<ApplicationRef> =>
	bootstrapApplication(
		AppComponent,
		{...config, providers: [provideZoneChangeDetection(), ...config.providers]},
		context
	);

export default bootstrap;
