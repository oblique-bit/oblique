import type {ApplicationRef} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {config} from './app/app.config.server';

const bootstrap = async (): Promise<ApplicationRef> => bootstrapApplication(AppComponent, config);

export default bootstrap;
