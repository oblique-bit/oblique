import {waitForAsync} from '@angular/core/testing';
import {ObOffCanvasToggleDirective} from './off-canvas-toggle.directive';
import {ObOffCanvasService} from './off-canvas.service';

describe('ObOffCanvasToggleDirective', () => {
	let directive: ObOffCanvasToggleDirective;
	let service: ObOffCanvasService;

	beforeEach(
		waitForAsync(() => {
			service = {open: false} as ObOffCanvasService;
			directive = new ObOffCanvasToggleDirective(service, window);
		})
	);

	it('should create an instance', () => {
		expect(directive).toBeTruthy();
	});

	describe('toggle', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});
		afterEach(() => {
			jest.useRealTimers();
		});
		it('should open with no event provided', () => {
			directive.toggle();
			jest.advanceTimersToNextTimer();
			expect(service.open).toBe(true);
		});
		it('should open with a mouse click', () => {
			directive.toggle(new MouseEvent('click'));
			jest.advanceTimersToNextTimer();
			expect(service.open).toBe(true);
		});
		it('should open with Enter key on a div', () => {
			const event = {target: {nodeName: 'DIV'}} as unknown as KeyboardEvent;
			directive.toggle(event);
			jest.advanceTimersToNextTimer();
			expect(service.open).toBe(true);
		});
		it('should not open with Enter key on a button', () => {
			const event = {target: {nodeName: 'BUTTON'}} as unknown as KeyboardEvent;
			directive.toggle(event);
			jest.advanceTimersToNextTimer();
			expect(service.open).toBe(false);
		});
	});
});
