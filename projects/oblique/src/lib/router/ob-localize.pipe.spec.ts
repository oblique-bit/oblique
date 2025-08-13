import {ObLocalizePipe} from './ob-localize.pipe';
import {TestBed} from '@angular/core/testing';
import {OB_HAS_LANGUAGE_IN_URL, provideObliqueConfiguration} from '../utilities';
import {TranslateLoader, TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';
import {provideHttpClient} from '@angular/common/http';

describe(ObLocalizePipe.name, () => {
	let pipe: ObLocalizePipe;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ObLocalizePipe,
				provideHttpClient(),
				provideObliqueConfiguration({
					accessibilityStatement: {
						createdOn: new Date(),
						applicationName: '',
						applicationOperator: '',
						conformity: 'none',
						contact: [{email: ''}]
					}
				}),
				{provide: TranslateLoader, useValue: {getTranslation: () => of({})}}
			]
		});
	});

	describe.each([
		{text: 'without', hasLanguageInUrl: false},
		{text: 'with', hasLanguageInUrl: true}
	])('$text hasLanguageInUrl', ({hasLanguageInUrl}) => {
		beforeEach(async () => {
			TestBed.overrideProvider(OB_HAS_LANGUAGE_IN_URL, {useValue: hasLanguageInUrl});
			await TestBed.compileComponents();
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
