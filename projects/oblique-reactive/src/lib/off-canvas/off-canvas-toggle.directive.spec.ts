import {OffCanvasToggleDirective} from 'oblique-reactive';
import {OffCanvasService} from 'oblique-reactive';

describe('OffcanvasToggleDirective', () => {
	it('should create an instance', () => {
		const mockService = jasmine.createSpyObj('OffCanvasService', ['']);
		const directive = new OffCanvasToggleDirective(mockService);
		expect(directive).toBeTruthy();
	});
});
