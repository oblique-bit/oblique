import {ObLocalizePipe} from './ob-localize.pipe';
import {TestBed} from '@angular/core/testing';
import {OB_HAS_LANGUAGE_IN_URL, provideObliqueTestingConfiguration} from '../utilities';
import {TranslateService} from '@ngx-translate/core';

describe(ObLocalizePipe.name, () => {
	let pipe: ObLocalizePipe;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ObLocalizePipe, provideObliqueTestingConfiguration()]
		});
	});

	describe.each([
		{text: 'without', hasLanguageInUrl: false},
		{text: 'with', hasLanguageInUrl: true}
	])('$text hasLanguageInUrl', ({hasLanguageInUrl}) => {
		beforeEach(async () => {
			await TestBed.overrideProvider(OB_HAS_LANGUAGE_IN_URL, {useValue: hasLanguageInUrl}).compileComponents();
			pipe = TestBed.inject(ObLocalizePipe);
		});

		test('pipe creation', () => {
			expect(pipe).toBeTruthy();
		});

		describe(`${ObLocalizePipe.prototype.transform.name} method`, () => {
			test.each(['de', 'fr', 'it', 'es'])('%s is correctly prefixed', lang => {
				TestBed.inject(TranslateService).use(lang);
				expect(pipe.transform('route')).toBe(hasLanguageInUrl ? `${lang}/route` : 'route');
			});
		});
	});
});
