/* tslint:disable:no-unused-variable */

import {TestBed, inject, fakeAsync, tick} from '@angular/core/testing';
import {SpinnerService} from './spinner.service';
import {NotificationService} from '../notification/notification.service';
import {Subscription} from 'rxjs/Subscription';

//TODO: implement tests for NotificationService
describe('SpinnerService', () => {
	let mockNotificationService;
	beforeEach(() => {
		mockNotificationService = jasmine.createSpyObj('NotificationService', ['error']);
		TestBed.configureTestingModule({
			providers: [
				SpinnerService,
				{provide: NotificationService, useValue: mockNotificationService},
				{provide: 'spinnerMaxTimeout', useValue: 100}
			]
		});
	});

	it('should emit statusChangeEvent on spinnerStart', inject([SpinnerService], (service: SpinnerService) => {
		const subscription: Subscription = service.onSpinnerStatusChange.subscribe((spinnerActive) => {
			expect(spinnerActive).toBeTruthy();
			// Unsubscribe after first test:
			subscription.unsubscribe();
		});
		service.activateSpinner();
	}));

	it('should add error message after maxTimeout is reached', fakeAsync(inject([SpinnerService], (service: SpinnerService) => {
		service.activateSpinner();
		tick(150);
		expect(mockNotificationService.error).toHaveBeenCalled();
	})));
});
