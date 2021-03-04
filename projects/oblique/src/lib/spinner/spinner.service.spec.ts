import {fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {first} from 'rxjs/operators';
import {ObISpinnerEvent} from './spinner.model';
import {ObSpinnerService} from './spinner.service';

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
			providers: [ObSpinnerService]
		});
	});

	it('should emit a SpinnerEvent if activated', inject([ObSpinnerService], (service: ObSpinnerService) => {
		service.events$.pipe(first()).subscribe((event: ObISpinnerEvent) => {
			expect(event).toBe({active: true, channel: ObSpinnerService.CHANNEL});
		});
		service.activate();
	}));

	it('should emit a SpinnerEvent on a custom channel if activated', inject([ObSpinnerService], (service: ObSpinnerService) => {
		const channel = 'CUSTOM';
		service.events$.pipe(first()).subscribe((event: ObISpinnerEvent) => {
			expect(event).toBe({active: true, channel: channel});
		});
		service.activate(channel);
	}));

	it('should emit a SpinnerEvent if deactivated', inject([ObSpinnerService], (service: ObSpinnerService) => {
		service.events$.pipe(first()).subscribe((event: ObISpinnerEvent) => {
			expect(event).toBe({active: false, channel: ObSpinnerService.CHANNEL});
		});
		service.deactivate();
	}));

	it('should emit a SpinnerEvent on a custom channel if deactivated', inject([ObSpinnerService], (service: ObSpinnerService) => {
		const channel = 'CUSTOM';
		service.events$.pipe(first()).subscribe((event: ObISpinnerEvent) => {
			expect(event).toBe({active: false, channel: channel});
		});
		service.deactivate(channel);
	}));

	it('should not emit if there more activations than deactivation', fakeAsync(
		inject([ObSpinnerService], (service: ObSpinnerService) => {
			service.activate();
			service.activate();
			let emitted = false;
			service.events$.subscribe(() => {
				emitted = true;
			});
			service.deactivate();
			tick(1000);
			expect(emitted).toBe(false);
		})
	));

	it('should emit deactivate event when activate and deactivate are called equally', inject([ObSpinnerService], (service: ObSpinnerService) => {
		service.activate();
		service.activate();

		service.events$.pipe().subscribe((event: ObISpinnerEvent) => {
			expect(event).toBe({active: false, channel: ObSpinnerService.CHANNEL});
		});

		service.deactivate();
		service.deactivate(); //Only now, deactivate event is emitted.
	}));

	it('should deactivate immediately, when forceDeactivate is called.', inject([ObSpinnerService], (service: ObSpinnerService) => {
		service.activate();
		service.activate();

		service.events$.pipe().subscribe((event: ObISpinnerEvent) => {
			expect(event).toBe({active: false, channel: ObSpinnerService.CHANNEL});
		});

		service.forceDeactivate();
	}));
});
