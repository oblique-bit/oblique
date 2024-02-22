import {TestBed} from '@angular/core/testing';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {ObSafeImagePipe} from './safe-image.pipe';

describe('ObSafeImagePipe', () => {
	let sanitizer: DomSanitizer;
	let pipe: ObSafeImagePipe;
	const mockBypassSecurityTrustResourceUrl = 'mockValue';

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{provide: DomSanitizer, useValue: {bypassSecurityTrustResourceUrl: jest.fn().mockReturnValue(mockBypassSecurityTrustResourceUrl)}}
			]
		});
		sanitizer = TestBed.inject(DomSanitizer);
		pipe = new ObSafeImagePipe(sanitizer);
	});

	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	describe('transform', () => {
		let result: SafeHtml;
		beforeEach(() => {
			result = pipe.transform('test');
		});

		it('should call bypassSecurityTrustResourceUrl once', () => {
			expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledTimes(1);
		});

		it('should call bypassSecurityTrustResourceUrl with the same parameter', () => {
			expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith('test');
		});

		it('should return the value given by bypassSecurityTrustResourceUrl', () => {
			expect(result).toBe(mockBypassSecurityTrustResourceUrl);
		});
	});
});
