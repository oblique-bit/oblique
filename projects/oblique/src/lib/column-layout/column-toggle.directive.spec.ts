import {ObColumnPanelDirective} from './column-panel.directive';
import {ObColumnToggleDirective} from './column-toggle.directive';

describe('ObColumnToggleDirective', () => {
	let parentDirective: ObColumnPanelDirective;
	let directive: ObColumnToggleDirective;

	beforeEach(() => {
		parentDirective = new ObColumnPanelDirective();
		directive = new ObColumnToggleDirective(parentDirective);
	});

	it('should create an instance', () => {
		expect(directive).toBeTruthy();
	});

	describe('Method onclick', () => {
		it('should call parent method toggle', () => {
			jest.spyOn(parentDirective, 'toggle');

			directive.onclick();

			expect(parentDirective.toggle).toHaveBeenCalledTimes(1);
		});
	});
});
