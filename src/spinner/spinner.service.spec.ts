/* tslint:disable:no-unused-variable */

import {TestBed, inject, fakeAsync, tick} from '@angular/core/testing';
import {SpinnerService} from './spinner.service';
import {NotificationService} from '../notification/notification.service';
import {Subscription} from 'rxjs/Subscription';

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
