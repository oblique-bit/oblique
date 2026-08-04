import {TestBed} from '@angular/core/testing';
import {OB_BANNER, obProvideBanner} from './banner.provider';
import {ObIBanner} from './banner.model';

describe('banner.provider', () => {
	const config: ObIBanner = {text: 'text'};
	beforeEach(() => {
		TestBed.configureTestingModule({providers: [obProvideBanner(config)]});
	});

	test(obProvideBanner.name, () => {
		expect(TestBed.inject(OB_BANNER)).toEqual(config);
	});
});
