import {TestBed} from '@angular/core/testing';
import {firstValueFrom} from 'rxjs';
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

	it('should emit open state changes', async () => {
		const result = firstValueFrom(service.opened$);
		service.open = true;
		const open = await result;
		expect(open).toBe(true);
		expect(service.open).toBe(true);
	});
});
