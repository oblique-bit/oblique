import {OffCanvasToggleDirective} from './off-canvas-toggle.directive';
import {OffCanvasService} from './off-canvas.service';

describe('OffcanvasToggleDirective', () => {
	it('should create an instance', () => {
		const offcanvasService = new OffCanvasService();
		const directive = new OffCanvasToggleDirective(offcanvasService);
		expect(directive).toBeTruthy();
	});
});
