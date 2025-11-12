import {TestBed} from '@angular/core/testing';
import {WINDOW} from '../../../utilities';
import {ObIsCurrentUrlPipe} from './is-current-url.pipe';

describe('IsCurrentUrlPipe', () => {
	let pipe: ObIsCurrentUrlPipe;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [{provide: WINDOW, useValue: window}, ObIsCurrentUrlPipe],
		}).compileComponents();

		pipe = TestBed.inject(ObIsCurrentUrlPipe);
	});

	it('should return true when the current url match the input url', () => {
		const result = pipe.transform(window.location.href);

		expect(result).toBe(true);
	});

	it("should return false when the current url doesn't match the input url", () => {
		const result = pipe.transform('random-url');

		expect(result).toBe(false);
	});
});
