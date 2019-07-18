import {TranslateParamsPipe} from './translate-params.pipe';
import {TranslateService} from '@ngx-translate/core';
import {inject, TestBed} from '@angular/core/testing';

describe('TranslateParamsPipe', () => {
	beforeEach(() => {

		const mockTranslate = {
			instant: jest.fn().mockImplementation((value: string, arg?: { value: string }) => {
				return typeof arg === 'object' && arg.value
					? value.replace('{{value}}', arg.value)
					: value;
			})
		};
		TestBed
			.configureTestingModule({
				providers: [{provide: TranslateService, useValue: mockTranslate}]
			});
	});

	it('create an instance', inject([TranslateService], (translate: TranslateService) => {
		const pipe = new TranslateParamsPipe(translate);
		expect(pipe).toBeTruthy();
	}));

	it('translate without argument', inject([TranslateService], (translate: TranslateService) => {
		const pipe = new TranslateParamsPipe(translate);
		expect(pipe.transform('test')).toBe('test');
	}));

	it('translate with a string argument', inject([TranslateService], (translate: TranslateService) => {
		const pipe = new TranslateParamsPipe(translate);
		expect(pipe.transform('test1', 'test2')).toBe('test1');
	}));

	it('translate with an object argument', inject([TranslateService], (translate: TranslateService) => {
		const pipe = new TranslateParamsPipe(translate);
		expect(pipe.transform('test1 {{value}}', {value: 'test2'})).toBe('test1 test2');
	}));
});
