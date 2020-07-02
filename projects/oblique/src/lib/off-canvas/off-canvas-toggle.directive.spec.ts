import {async, TestBed} from '@angular/core/testing';
import {ObOffCanvasToggleDirective} from './off-canvas-toggle.directive';
import {ObOffCanvasService} from './off-canvas.service';

describe('OffcanvasToggleDirective', () => {
	let offCanvasService;

	beforeEach(async(() => {
		offCanvasService = jest.fn();
		TestBed.configureTestingModule({
			declarations: [ObOffCanvasToggleDirective],
			providers: [{provide: ObOffCanvasService, useValue: offCanvasService}]
		}).compileComponents();
	}));

	it('should create an instance', () => {
		const mockService = jest.fn();
		const directive = new ObOffCanvasToggleDirective((mockService as unknown) as ObOffCanvasService);
		expect(directive).toBeTruthy();
	});
});
