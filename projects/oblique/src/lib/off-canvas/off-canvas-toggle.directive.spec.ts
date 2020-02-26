import {ObOffCanvasService, ObOffCanvasToggleDirective} from 'oblique';
import {async, TestBed} from '@angular/core/testing';

describe('OffcanvasToggleDirective', () => {
	let offCanvasService;

	beforeEach(async(() => {
		offCanvasService = jest.fn();
		TestBed.configureTestingModule({
			declarations: [ObOffCanvasToggleDirective],
			providers: [
				{provide: ObOffCanvasService, useValue: offCanvasService}
			]
		})
			.compileComponents();
	}));

	it('should create an instance', () => {
		const mockService = jest.fn();
		const directive = new ObOffCanvasToggleDirective(mockService as unknown as ObOffCanvasService);
		expect(directive).toBeTruthy();
	});
});
