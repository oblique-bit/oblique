import {InjectionToken, Provider} from '@angular/core';
import {ObConsoleConfiguration} from './ob-console.model';

export const OB_CONSOLE_CONFIGURATION = new InjectionToken<ObConsoleConfiguration>('OB_CONSOLE_CONFIGURATION');

export function obProvideConsole(config: ObConsoleConfiguration): Provider[] {
	return [{provide: OB_CONSOLE_CONFIGURATION, useValue: config}];
}

export const obDefaultConsoleConfiguration: ObConsoleConfiguration = {
	silencedLabels: new Set(),
};
