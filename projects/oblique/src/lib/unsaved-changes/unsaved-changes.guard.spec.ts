import {TestBed} from '@angular/core/testing';
import {ObUnsavedChangesGuard} from './unsaved-changes.guard';
import {ObUnsavedChangesService} from './unsaved-changes.service';

describe('ObUnsavedChangesGuard', () => {
	let guard: ObUnsavedChangesGuard;

	const mockUnsavedChangesService = {
		canDeactivate: jest.fn()
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{provide: ObUnsavedChangesService, useValue: mockUnsavedChangesService}]
		});
		guard = TestBed.inject(ObUnsavedChangesGuard);
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});

	describe('canDeactivate', () => {
		it('should call canDeactivate once', () => {
			guard.canDeactivate();

			expect(mockUnsavedChangesService.canDeactivate).toBeCalledTimes(1);
		});

		it.each([false, true])('should return %s when the ObUnsavedChangesService returns %s', $expected => {
			jest.spyOn(mockUnsavedChangesService, 'canDeactivate').mockReturnValue($expected);

			expect(guard.canDeactivate()).toBe($expected);
		});
	});
});
