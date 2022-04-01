import {ObTranslateParamsPipe} from './translate-params.pipe';
import {TranslateService} from '@ngx-translate/core';
import {TestBed, inject} from '@angular/core/testing';

describe('TranslateParamsPipe', () => {
	beforeEach(() => {
		const mockTranslate = {
			instant: jest
				.fn()
				.mockImplementation((value: string, arg?: {value: string}) =>
					typeof arg === 'object' ? value.replace('{{value}}', arg.value) : value
				)
		};
		TestBed.configureTestingModule({
			providers: [{provide: TranslateService, useValue: mockTranslate}]
		});
	});

	it('create an instance', inject([TranslateService], (translate: TranslateService) => {
		const pipe = new ObTranslateParamsPipe(translate);
		expect(pipe).toBeTruthy();
	}));

	it('translate without argument', inject([TranslateService], (translate: TranslateService) => {
		const pipe = new ObTranslateParamsPipe(translate);
		expect(pipe.transform('test')).toBe('test');
	}));

	it('translate with a string argument', inject([TranslateService], (translate: TranslateService) => {
		const pipe = new ObTranslateParamsPipe(translate);
		expect(pipe.transform('test1', 'test2')).toBe('test1');
	}));

	it('translate with an object argument', inject([TranslateService], (translate: TranslateService) => {
		const pipe = new ObTranslateParamsPipe(translate);
		expect(pipe.transform('test1 {{value}}', {value: 'test2'})).toBe('test1 test2');
	}));

	it('translate with an object argument with value 0 (string)', inject([TranslateService], (translate: TranslateService) => {
		const pipe = new ObTranslateParamsPipe(translate);
		expect(pipe.transform('test1 {{value}}', {value: '0'})).toBe('test1 0');
	}));

	it('translate with an object argument with value zero (number)', inject([TranslateService], (translate: TranslateService) => {
		const pipe = new ObTranslateParamsPipe(translate);
		expect(pipe.transform('test1 {{value}}', {value: 0})).toBe('test1 0');
	}));
});
