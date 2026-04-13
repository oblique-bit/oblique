import {TestBed} from '@angular/core/testing';
import {ObColumnPanelDirective} from './column-panel.directive';
import {ObColumnToggleDirective} from './column-toggle.directive';

describe('ObColumnToggleDirective', () => {
	let parentDirective: ObColumnPanelDirective;
	let directive: ObColumnToggleDirective;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ObColumnPanelDirective, ObColumnToggleDirective],
		});
		parentDirective = TestBed.inject(ObColumnPanelDirective);
		directive = TestBed.inject(ObColumnToggleDirective);
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
