import {TestBed, inject} from '@angular/core/testing';
import {Subscription} from 'rxjs/Subscription';
import {SpinnerService} from './spinner.service';
import {NotificationService} from '../notification';

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
		const subscription: Subscription = service.onSpinnerStatusChange.subscribe((spinnerActive) => {
			expect(spinnerActive).toBeTruthy();
			// Unsubscribe after first test:
			subscription.unsubscribe();
		});
		service.activateSpinner();
	}));

	it('should emit statusChangeEvent on deactivateSpinner', inject([SpinnerService], (service: SpinnerService) => {
		const subscription: Subscription = service.onSpinnerStatusChange.subscribe((spinnerActive) => {
			expect(spinnerActive).toBeFalsy();
			// Unsubscribe after first test:
			subscription.unsubscribe();
		});
		service.deactivateSpinner();
	}));
});
