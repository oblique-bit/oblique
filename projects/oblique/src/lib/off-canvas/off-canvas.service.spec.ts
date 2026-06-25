import {TestBed} from '@angular/core/testing';
import {ObOffCanvasService} from './off-canvas.service';

describe(ObOffCanvasService.name, () => {
	let service: ObOffCanvasService;

	beforeEach(() => {
		TestBed.configureTestingModule({providers: [ObOffCanvasService]});
		service = TestBed.inject(ObOffCanvasService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should be closed by default', () => {
		expect(service.open).toBe(false);
	});

	it('should emit open state changes', done => {
		service.opened$.subscribe(open => {
			expect(open).toBe(true);
			expect(service.open).toBe(true);
			done();
		});

		service.open = true;
	});
});
