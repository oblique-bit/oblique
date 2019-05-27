import {OffCanvasService, OffCanvasToggleDirective} from 'oblique-reactive';
import {async, TestBed} from '@angular/core/testing';

describe('OffcanvasToggleDirective', () => {
	let offCanvasService;

	beforeEach(async(() => {
		offCanvasService = jest.fn();
		TestBed.configureTestingModule({
			declarations: [OffCanvasToggleDirective],
			providers: [
				{provide: OffCanvasService, useValue: offCanvasService}
			]
		})
			.compileComponents();
	}));

	it('should create an instance', () => {
		const mockService = jest.fn();
		const directive = new OffCanvasToggleDirective(mockService as unknown as OffCanvasService);
		expect(directive).toBeTruthy();
	});
});
