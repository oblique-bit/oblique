import {inject, TestBed} from '@angular/core/testing';
import {first} from 'rxjs/operators';
import {ObNotificationService, ObSpinnerService} from 'oblique';
import {ObISpinnerEvent} from './spinner-event';

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
				ObSpinnerService,
				{provide: ObNotificationService, useValue: mockNotificationService}
			]
		});
	});

	it('should emit a SpinnerEvent if activated', inject([ObSpinnerService], (service: ObSpinnerService) => {
		service.events.pipe(first()).subscribe((event: ObISpinnerEvent) => {
			expect(event).toBeDefined();
			expect(event.active).toBeTruthy();
			expect(event.channel).toBe(ObSpinnerService.CHANNEL);
		});
		service.activate();
	}));

	it('should emit a SpinnerEvent on a custom channel if activated', inject([ObSpinnerService], (service: ObSpinnerService) => {
		const channel = 'CUSTOM';
		service.events.pipe(first()).subscribe((event: ObISpinnerEvent) => {
			expect(event).toBeDefined();
			expect(event.active).toBeTruthy();
			expect(event.channel).toBe(channel);
		});
		service.activate(channel);
	}));

	it('should emit a SpinnerEvent if deactivated', inject([ObSpinnerService], (service: ObSpinnerService) => {
		service.events.pipe(first()).subscribe((event: ObISpinnerEvent) => {
			expect(event).toBeDefined();
			expect(event.active).toBeFalsy();
			expect(event.channel).toBe(ObSpinnerService.CHANNEL);
		});
		service.deactivate();
	}));

	it('should emit a SpinnerEvent on a custom channel if deactivated', inject([ObSpinnerService], (service: ObSpinnerService) => {
		const channel = 'CUSTOM';
		service.events.pipe(first()).subscribe((event: ObISpinnerEvent) => {
			expect(event).toBeDefined();
			expect(event.active).toBeFalsy();
			expect(event.channel).toBe(channel);
		});
		service.deactivate(channel);
	}));
});
