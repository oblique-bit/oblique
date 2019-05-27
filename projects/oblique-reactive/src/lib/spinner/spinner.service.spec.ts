import {inject, TestBed} from '@angular/core/testing';
import {first} from 'rxjs/operators';
import {NotificationService, SpinnerService} from 'oblique-reactive';
import {SpinnerEvent} from './spinner-event';

describe('SpinnerService', () => {
	let mockNotificationService;
	beforeEach(() => {

		mockNotificationService = {
			warning: jest.fn(),
			error: jest.fn(),
			success: jest.fn(),
			info: jest.fn()
		};

		TestBed.configureTestingModule({
			providers: [
				SpinnerService,
				{provide: NotificationService, useValue: mockNotificationService}
			]
		});
	});

	it('should emit a SpinnerEvent if activated', inject([SpinnerService], (service: SpinnerService) => {
		service.events.pipe(first()).subscribe((event: SpinnerEvent) => {
			expect(event).toBeDefined();
			expect(event.active).toBeTruthy();
			expect(event.channel).toBe(SpinnerService.CHANNEL);
		});
		service.activate();
	}));

	it('should emit a SpinnerEvent on a custom channel if activated', inject([SpinnerService], (service: SpinnerService) => {
		const channel = 'CUSTOM';
		service.events.pipe(first()).subscribe((event: SpinnerEvent) => {
			expect(event).toBeDefined();
			expect(event.active).toBeTruthy();
			expect(event.channel).toBe(channel);
		});
		service.activate(channel);
	}));

	it('should emit a SpinnerEvent if deactivated', inject([SpinnerService], (service: SpinnerService) => {
		service.events.pipe(first()).subscribe((event: SpinnerEvent) => {
			expect(event).toBeDefined();
			expect(event.active).toBeFalsy();
			expect(event.channel).toBe(SpinnerService.CHANNEL);
		});
		service.deactivate();
	}));

	it('should emit a SpinnerEvent on a custom channel if deactivated', inject([SpinnerService], (service: SpinnerService) => {
		const channel = 'CUSTOM';
		service.events.pipe(first()).subscribe((event: SpinnerEvent) => {
			expect(event).toBeDefined();
			expect(event.active).toBeFalsy();
			expect(event.channel).toBe(channel);
		});
		service.deactivate(channel);
	}));
});
