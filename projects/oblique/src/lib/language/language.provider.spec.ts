import {TestBed} from '@angular/core/testing';
import {OB_HAS_LANGUAGE_IN_URL, obProvideLanguageConfiguration} from './language.provider';

describe('language.provider', () => {
	const config = false;
	beforeEach(() => {
		TestBed.configureTestingModule({providers: [obProvideLanguageConfiguration(config)]});
	});

	test(obProvideLanguageConfiguration.name, () => {
		expect(TestBed.inject(OB_HAS_LANGUAGE_IN_URL)).toEqual(config);
	});
});
