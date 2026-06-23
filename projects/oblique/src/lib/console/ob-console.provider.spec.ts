import {TestBed} from '@angular/core/testing';
import {OB_CONSOLE_CONFIGURATION, obProvideConsole} from './ob-console.provider';
import {ObConsoleConfiguration} from './ob-console.model';

describe('ob-console.provider', () => {
	const config: ObConsoleConfiguration = {
		silencedLabels: new Set(),
	};
	beforeEach(() => {
		TestBed.configureTestingModule({providers: [obProvideConsole(config)]});
	});

	test(obProvideConsole.name, () => {
		expect(TestBed.inject(OB_CONSOLE_CONFIGURATION)).toEqual(config);
	});
});
