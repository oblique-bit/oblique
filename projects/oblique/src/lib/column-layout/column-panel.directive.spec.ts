import {ObColumnPanelDirective} from './column-panel.directive';

describe('ObColumnPanelDirective', () => {
	let directive: ObColumnPanelDirective;

	beforeEach(() => {
		directive = new ObColumnPanelDirective();
	});

	it('should create an instance', () => {
		expect(directive).toBeTruthy();
	});

	describe('Property collapsed', () => {
		it('should be false per default', () => {
			expect(directive.collapsed).toBe(false);
		});
	});

	describe('Method toggle', () => {
		it('should change collapsed to true when called once', () => {
			directive.toggle();

			expect(directive.collapsed).toBe(true);
		});

		it('should change collapsed to false when called twice', () => {
			directive.toggle();
			directive.toggle();

			expect(directive.collapsed).toBe(false);
		});

		it('should emit toggled boolean', done => {
			directive.toggled.subscribe(toggled => {
				expect(toggled).toBe(true);
				done();
			});

			directive.toggle();
		});
	});
});
