import {TestBed} from '@angular/core/testing';
import {TranslateNoOpCompiler, TranslateService} from '@ngx-translate/core';
import {OB_TRANSLATION_CONFIGURATION, provideObliqueTranslations} from './translation.providers';

describe('translation', () => {
	describe('with default configuration', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [provideObliqueTranslations()],
			});
		});

		it('should provide "OB_TRANSLATION_CONFIGURATION"', () => {
			expect(TestBed.inject(OB_TRANSLATION_CONFIGURATION)).toEqual({flatten: true});
		});

		it('should use "TranslateNoOpCompiler " as "TranslateCompiler"', () => {
			expect(TestBed.inject(TranslateService).compiler).toBeInstanceOf(TranslateNoOpCompiler);
		});
	});

	describe('with custom configuration', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [provideObliqueTranslations({flatten: false})],
			});
		});

		it('should provide "OB_TRANSLATION_CONFIGURATION"', () => {
			expect(TestBed.inject(OB_TRANSLATION_CONFIGURATION)).toEqual({
				flatten: false,
			});
		});

		it('should use "TranslateNoOpCompiler " as "TranslateCompiler"', () => {
			expect(TestBed.inject(TranslateService).compiler).toBeInstanceOf(TranslateNoOpCompiler);
		});
	});
});
