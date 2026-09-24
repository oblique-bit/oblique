import {TestBed} from '@angular/core/testing';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ObEPamsEnvironment, ObIPamsConfiguration} from './service-navigation.model';
import {OB_PAMS_CONFIGURATION, obProvideServiceNavigation} from './service-navigation.provider';
import {ObEportalCsrfInterceptor} from './eportal-csrf-interceptor/eportal-csrf-interceptor';

describe('service-navigation.provider', () => {
	const config: ObIPamsConfiguration = {
		environment: ObEPamsEnvironment.PROD,
		rootUrl: undefined,
	};

	describe(obProvideServiceNavigation.name, () => {
		test('custom configuration', () => {
			TestBed.configureTestingModule({providers: [obProvideServiceNavigation(config)]});
			const interceptors = TestBed.inject(HTTP_INTERCEPTORS, []);

			expect(TestBed.inject(OB_PAMS_CONFIGURATION)).toEqual(config);
			expect(interceptors.length).toBe(1);
			expect(interceptors[0] instanceof ObEportalCsrfInterceptor).toBe(true);
		});

		test('no configuration', () => {
			TestBed.configureTestingModule({providers: [obProvideServiceNavigation(undefined)]});
			expect(TestBed.inject(OB_PAMS_CONFIGURATION, null)).toBeNull();
			expect(TestBed.inject(HTTP_INTERCEPTORS, []).length).toBe(0);
		});
	});
});
