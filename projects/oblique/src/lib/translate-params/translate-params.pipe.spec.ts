import {ObTranslateParamsPipe} from './translate-params.pipe';
import {TranslateService} from '@ngx-translate/core';
import {TestBed} from '@angular/core/testing';

describe('TranslateParamsPipe', () => {
	let pipe;
	beforeEach(() => {
		const mockTranslate = {
			instant: jest
				.fn()
				.mockImplementation((value: string, arg?: {value: string}) =>
					typeof arg === 'object' ? value.replace('{{value}}', arg.value) : value
				),
		};
		TestBed.configureTestingModule({
			providers: [ObTranslateParamsPipe, {provide: TranslateService, useValue: mockTranslate}],
		});

		pipe = TestBed.inject(ObTranslateParamsPipe);
	});

	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('translate without argument', () => {
		expect(pipe.transform('test')).toBe('test');
	});

	it('translate with a string argument', () => {
		expect(pipe.transform('test1', 'test2')).toBe('test1');
	});

	it('translate with an object argument', () => {
		expect(pipe.transform('test1 {{value}}', {value: 'test2'})).toBe('test1 test2');
	});

	it('translate with an object argument with value 0 (string)', () => {
		expect(pipe.transform('test1 {{value}}', {value: '0'})).toBe('test1 0');
	});

	it('translate with an object argument with value zero (number)', () => {
		expect(pipe.transform('test1 {{value}}', {value: 0})).toBe('test1 0');
	});
});
