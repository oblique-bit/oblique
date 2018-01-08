import {TestBed, inject} from '@angular/core/testing';
import {first} from 'rxjs/operators';
import {NotificationService} from '../notification';
import {SpinnerService} from './spinner.service';

describe('SpinnerService', () => {
	let mockNotificationService;
	beforeEach(() => {
		mockNotificationService = jasmine.createSpyObj('NotificationService', ['error']);
		TestBed.configureTestingModule({
			providers: [
				SpinnerService,
				{provide: NotificationService, useValue: mockNotificationService}
			]
		});
	});

	it('should emit statusChangeEvent on activateSpinner', inject([SpinnerService], (service: SpinnerService) => {
		service.onSpinnerStatusChange.pipe(first()).subscribe((spinnerActive) => {
			expect(spinnerActive).toBeTruthy();
		});
		service.activateSpinner();
	}));

	it('should emit statusChangeEvent on deactivateSpinner', inject([SpinnerService], (service: SpinnerService) => {
		service.onSpinnerStatusChange.pipe(first()).subscribe((spinnerActive) => {
			expect(spinnerActive).toBeFalsy();
		});
		service.deactivateSpinner();
	}));
});
