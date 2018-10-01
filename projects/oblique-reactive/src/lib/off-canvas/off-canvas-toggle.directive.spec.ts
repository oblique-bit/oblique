import {OffCanvasToggleDirective} from 'oblique-reactive';
import {OffCanvasService} from 'oblique-reactive';

describe('OffcanvasToggleDirective', () => {
	it('should create an instance', () => {
		const offcanvasService = new OffCanvasService();
		const directive = new OffCanvasToggleDirective(offcanvasService);
		expect(directive).toBeTruthy();
	});
});
