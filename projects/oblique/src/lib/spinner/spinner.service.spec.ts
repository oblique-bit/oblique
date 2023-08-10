import {TestBed, fakeAsync, tick} from '@angular/core/testing';
import {first} from 'rxjs/operators';
import {ObISpinnerEvent} from './spinner.model';
import {ObSpinnerService} from './spinner.service';

describe(ObSpinnerService.name, () => {
	let service: ObSpinnerService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ObSpinnerService]
		});
		service = TestBed.inject(ObSpinnerService);
	});

	it('should emit a SpinnerEvent if activated', done => {
		service.events$.pipe(first()).subscribe((event: ObISpinnerEvent) => {
			expect(event).toEqual({active: true, channel: ObSpinnerService.CHANNEL});
			done();
		});
		service.activate();
	});

	it('should emit a SpinnerEvent on a custom channel if activated', done => {
		const channel = 'CUSTOM';
		service.events$.pipe(first()).subscribe((event: ObISpinnerEvent) => {
			expect(event).toEqual({active: true, channel});
			done();
		});
		service.activate(channel);
	});

	it('should emit a SpinnerEvent if deactivated', done => {
		service.events$.pipe(first()).subscribe((event: ObISpinnerEvent) => {
			expect(event).toEqual({active: false, channel: ObSpinnerService.CHANNEL});
			done();
		});
		service.deactivate();
	});

	it('should emit a SpinnerEvent on a custom channel if deactivated', done => {
		const channel = 'CUSTOM';
		service.events$.pipe(first()).subscribe((event: ObISpinnerEvent) => {
			expect(event).toEqual({active: false, channel});
			done();
		});
		service.deactivate(channel);
	});

	it('should not emit if there more activations than deactivation', fakeAsync(() => {
		service.activate();
		service.activate();
		let emitted = false;
		service.events$.subscribe(() => (emitted = true));
		service.deactivate();
		tick(1000);
		expect(emitted).toBe(false);
	}));

	it('should emit deactivate event when activate and deactivate are called equally', done => {
		service.activate();
		service.activate();

		service.events$.pipe().subscribe((event: ObISpinnerEvent) => {
			expect(event).toEqual({active: false, channel: ObSpinnerService.CHANNEL});
			done();
		});

		service.deactivate();
		service.deactivate(); // Only now, deactivate event is emitted.
	});

	it('should deactivate immediately, when forceDeactivate is called.', done => {
		service.activate();
		service.activate();

		service.events$.pipe().subscribe((event: ObISpinnerEvent) => {
			expect(event).toEqual({active: false, channel: ObSpinnerService.CHANNEL});
			done();
		});

		service.forceDeactivate();
	});
});
