import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {WINDOW} from '../utilities';
import {OBLIQUE_POPOVER_CLOSE_ONLY_ON_TOGGLE, OBLIQUE_POPOVER_TOGGLE_HANDLE, ObPopoverDirective} from './popover.directive';
import {ObEToggleType} from './popover.model';

@Component({
	template: `
		<button [obPopover]="myPopover">Open Popover</button>
		<ng-template #myPopover>
			<p>Hello World</p>
		</ng-template>
	`
})
class TestPopoverComponent {}

describe('Popover', () => {
	let fixture: ComponentFixture<TestPopoverComponent>;
	let directive: ObPopoverDirective;
	let popover: HTMLElement;
	let toggle: HTMLElement;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TestPopoverComponent, ObPopoverDirective],
			providers: [{provide: WINDOW, useValue: window}],
			schemas: [NO_ERRORS_SCHEMA]
		});
	});

	describe('without injection tokens', () => {
		beforeEach(() => {
			globalSetup();
		});

		it('should create an instance', () => {
			expect(fixture.componentInstance).toBeTruthy();
		});

		it('should be created', () => {
			expect(directive).toBeTruthy();
		});

		it('should have ob-popover class', () => {
			expect(toggle.classList.contains('ob-popover')).toBe(true);
		});

		it('should not be present in the DOM on start', () => {
			popover = document.querySelector('.ob-popover-content');
			expect(popover).toBeNull();
		});

		describe('toggle', () => {
			afterEach(() => {
				jest.useRealTimers();
			});

			describe('with toggleHandle input not set', () => {
				it("should call open if there's no popover", () => {
					jest.spyOn(directive, 'open');
					directive.close();
					toggle.click();
					expect(directive.open).toHaveBeenCalled();
				});

				it("should call close if there's a popover", () => {
					jest.spyOn(directive, 'close');
					directive.open();
					toggle.click();
					expect(directive.close).toHaveBeenCalled();
				});
			});

			describe('with toggleHandle input set to click', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.CLICK;
					directive.ngOnChanges();
				});

				it("should call open if there's no popover", () => {
					jest.spyOn(directive, 'open');
					directive.close();
					toggle.click();
					expect(directive.open).toHaveBeenCalled();
				});

				it("should call close if there's a popover", () => {
					jest.spyOn(directive, 'close');
					directive.open();
					toggle.click();
					expect(directive.close).toHaveBeenCalled();
				});
			});

			describe('with toggleHandle input set to hover', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.HOVER;
					directive.ngOnChanges();
				});

				it("should call open if there's no popover", () => {
					jest.spyOn(directive, 'open');
					directive.close();
					toggle.click();
					expect(directive.open).not.toHaveBeenCalled();
				});

				it("should call close if there's a popover", () => {
					jest.spyOn(directive, 'close');
					directive.open();
					toggle.click();
					expect(directive.close).not.toHaveBeenCalled();
				});
			});
		});

		describe('open', () => {
			beforeEach(() => {
				setupAndOpen();
			});

			afterEach(() => {
				jest.useRealTimers();
			});

			it('should insert the popover', () => {
				expect(popover).toBeTruthy();
			});

			it('should have an id', () => {
				expect(/popover-\d+-content/.test(popover.getAttribute('id'))).toBe(true);
			});

			it('should have the tooltip role', () => {
				expect(popover.getAttribute('role')).toBe('tooltip');
			});

			it('should have an arrow', () => {
				expect(popover.querySelector('.ob-popover-arrow')).toBeTruthy();
			});
		});

		describe('close', () => {
			it('should not throw an error when closed before opened', () => {
				directive.close();
				expect(true).toBe(true);
			});

			it('should remove the popover from the DOM', () => {
				jest.useFakeTimers();
				directive.open();
				jest.runOnlyPendingTimers();
				directive.close();
				// fixture.detectChanges();
				popover = document.querySelector('.ob-popover-content');
				expect(popover).toBeNull();
				jest.useRealTimers();
			});
		});

		describe('handleMouseEnter', () => {
			afterEach(() => {
				jest.useRealTimers();
			});

			describe('with toggleHandle input not set', () => {
				beforeEach(() => {
					toggleWithMouseEnter();
				});

				it('should not insert the popover', () => {
					expect(popover).toBeFalsy();
				});
			});

			describe('with toggleHandle input set to click', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.CLICK;
					toggleWithMouseEnter();
				});

				it('should not insert the popover', () => {
					expect(popover).toBeFalsy();
				});
			});

			describe('with toggleHandle input set to hover', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.HOVER;
					toggleWithMouseEnter();
				});

				it('should insert the popover', () => {
					expect(popover).toBeTruthy();
				});

				it('should have an id', () => {
					expect(/popover-\d+-content/.test(popover.getAttribute('id'))).toBe(true);
				});

				it('should have the tooltip role', () => {
					expect(popover.getAttribute('role')).toBe('tooltip');
				});

				it('should have an arrow', () => {
					expect(popover.querySelector('.ob-popover-arrow')).toBeTruthy();
				});
			});
		});

		describe('handleMouseLeave', () => {
			afterEach(() => {
				jest.useRealTimers();
			});

			describe('with toggleHandle input not set', () => {
				it('should not throw an error when closed before opened', () => {
					directive.handleMouseLeave();

					expect(true).toBe(true);
				});

				it('should not remove the popover from the DOM', () => {
					setupAndOpen();

					directive.handleMouseLeave();

					popover = document.querySelector('.ob-popover-content');
					expect(popover).toBeTruthy();
				});
			});

			describe('with toggleHandle input set to click', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.CLICK;
					directive.ngOnChanges();
				});

				it('should not throw an error when closed before opened', () => {
					directive.handleMouseLeave();

					expect(true).toBe(true);
				});

				it('should not remove the popover from the DOM', () => {
					setupAndOpen();

					directive.handleMouseLeave();

					popover = document.querySelector('.ob-popover-content');
					expect(popover).toBeTruthy();
				});
			});

			describe('with toggleHandle input set to hover', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.HOVER;
					directive.ngOnChanges();
				});

				it('should not throw an error when closed before opened', () => {
					directive.handleMouseLeave();

					expect(true).toBe(true);
				});

				it('should remove the popover from the DOM', () => {
					setupAndOpen();

					directive.handleMouseLeave();

					popover = document.querySelector('.ob-popover-content');
					expect(popover).toBeNull();
				});
			});
		});

		describe('ngOnDestroy', () => {
			it('should close the popover', () => {
				jest.spyOn(directive, 'close');
				directive.ngOnDestroy();
				expect(directive.close).toHaveBeenCalled();
			});
		});

		describe('events', () => {
			afterEach(() => {
				jest.useRealTimers();
			});

			describe('with closeOnlyOnToggle input not set', () => {
				beforeEach(() => {
					jest.spyOn(directive, 'close');
					jest.useFakeTimers();
					directive.open();
					jest.runOnlyPendingTimers();
					popover = document.querySelector('.ob-popover-content');
				});

				it('should not close the popover upon click on the popover', () => {
					popover.click();
					expect(directive.close).not.toHaveBeenCalled();
				});

				it('should close the popover upon click on body', () => {
					document.querySelector('body').click();
					expect(directive.close).toHaveBeenCalled();
				});

				it('should close the popover on Escape hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
					expect(directive.close).toHaveBeenCalled();
				});

				it('should not close the popover on Enter hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
					expect(directive.close).not.toHaveBeenCalled();
				});
			});

			describe('with closeOnlyOnToggle input set to false', () => {
				beforeEach(() => {
					directive.closeOnlyOnToggle = false;
					directive.ngOnChanges();

					jest.spyOn(directive, 'close');
					jest.useFakeTimers();
					directive.open();
					jest.runOnlyPendingTimers();
					popover = document.querySelector('.ob-popover-content');
				});

				it('should not close the popover upon click on the popover', () => {
					popover.click();
					expect(directive.close).not.toHaveBeenCalled();
				});

				it('should close the popover upon click on body', () => {
					document.querySelector('body').click();
					expect(directive.close).toHaveBeenCalled();
				});

				it('should close the popover on Escape hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
					expect(directive.close).toHaveBeenCalled();
				});

				it('should not close the popover on Enter hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
					expect(directive.close).not.toHaveBeenCalled();
				});
			});

			describe('with closeOnlyOnToggle input set to true', () => {
				beforeEach(() => {
					directive.closeOnlyOnToggle = true;
					directive.ngOnChanges();

					jest.spyOn(directive, 'close');
					jest.useFakeTimers();
					directive.open();
					jest.runOnlyPendingTimers();
					popover = document.querySelector('.ob-popover-content');
				});

				it('should not close the popover upon click on the popover', () => {
					popover.click();
					expect(directive.close).not.toHaveBeenCalled();
				});

				it('should not close the popover upon click on body', () => {
					document.querySelector('body').click();
					expect(directive.close).not.toHaveBeenCalled();
				});

				it('should not close the popover on Escape hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
					expect(directive.close).not.toHaveBeenCalled();
				});

				it('should not close the popover on Enter hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
					expect(directive.close).not.toHaveBeenCalled();
				});
			});
		});

		describe('with a custom id', () => {
			it('should add the same id', () => {
				directive.id = 'popover';
				directive.ngOnInit();
				jest.useFakeTimers();
				directive.open();
				jest.runOnlyPendingTimers();
				popover = document.querySelector('.ob-popover-content');
				expect(popover.getAttribute('id')).toBe('popover-content');
			});
		});
	});

	describe('with OBLIQUE_POPOVER_TOGGLE_HANDLE set to click', () => {
		beforeEach(() => {
			TestBed.overrideProvider(OBLIQUE_POPOVER_TOGGLE_HANDLE, {useValue: ObEToggleType.CLICK});

			globalSetup();
		});

		describe('toggle', () => {
			afterEach(() => {
				jest.useRealTimers();
			});

			describe('with toggleHandle input not set', () => {
				it("should call open if there's no popover", () => {
					jest.spyOn(directive, 'open');
					directive.close();
					toggle.click();
					expect(directive.open).toHaveBeenCalled();
				});

				it("should call close if there's a popover", () => {
					jest.spyOn(directive, 'close');
					directive.open();
					toggle.click();
					expect(directive.close).toHaveBeenCalled();
				});
			});

			describe('with toggleHandle input set to click', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.CLICK;
					directive.ngOnChanges();
				});

				it("should call open if there's no popover", () => {
					jest.spyOn(directive, 'open');
					directive.close();
					toggle.click();
					expect(directive.open).toHaveBeenCalled();
				});

				it("should call close if there's a popover", () => {
					jest.spyOn(directive, 'close');
					directive.open();
					toggle.click();
					expect(directive.close).toHaveBeenCalled();
				});
			});

			describe('with toggleHandle input set to hover', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.HOVER;
					directive.ngOnChanges();
				});

				it("should call open if there's no popover", () => {
					jest.spyOn(directive, 'open');
					directive.close();
					toggle.click();
					expect(directive.open).not.toHaveBeenCalled();
				});

				it("should call close if there's a popover", () => {
					jest.spyOn(directive, 'close');
					directive.open();
					toggle.click();
					expect(directive.close).not.toHaveBeenCalled();
				});
			});
		});

		describe('handleMouseEnter', () => {
			afterEach(() => {
				jest.useRealTimers();
			});

			describe('with toggleHandle input not set', () => {
				beforeEach(() => {
					toggleWithMouseEnter();
				});

				it('should not insert the popover', () => {
					expect(popover).toBeFalsy();
				});
			});

			describe('with toggleHandle input set to click', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.CLICK;
					toggleWithMouseEnter();
				});

				it('should not insert the popover', () => {
					expect(popover).toBeFalsy();
				});
			});

			describe('with toggleHandle input set to hover', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.HOVER;
					toggleWithMouseEnter();
				});

				it('should insert the popover', () => {
					expect(popover).toBeTruthy();
				});

				it('should have an id', () => {
					expect(/popover-\d+-content/.test(popover.getAttribute('id'))).toBe(true);
				});

				it('should have the tooltip role', () => {
					expect(popover.getAttribute('role')).toBe('tooltip');
				});

				it('should have an arrow', () => {
					expect(popover.querySelector('.ob-popover-arrow')).toBeTruthy();
				});
			});
		});

		describe('handleMouseLeave', () => {
			afterEach(() => {
				jest.useRealTimers();
			});

			describe('with toggleHandle input not set', () => {
				it('should not throw an error when closed before opened', () => {
					directive.handleMouseLeave();

					expect(true).toBe(true);
				});

				it('should not remove the popover from the DOM', () => {
					setupAndOpen();

					directive.handleMouseLeave();

					popover = document.querySelector('.ob-popover-content');
					expect(popover).toBeTruthy();
				});
			});

			describe('with toggleHandle input set to click', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.CLICK;
					directive.ngOnChanges();
				});

				it('should not throw an error when closed before opened', () => {
					directive.handleMouseLeave();

					expect(true).toBe(true);
				});

				it('should not remove the popover from the DOM', () => {
					setupAndOpen();

					directive.handleMouseLeave();

					popover = document.querySelector('.ob-popover-content');
					expect(popover).toBeTruthy();
				});
			});

			describe('with toggleHandle input set to hover', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.HOVER;
					directive.ngOnChanges();
				});

				it('should not throw an error when closed before opened', () => {
					directive.handleMouseLeave();

					expect(true).toBe(true);
				});

				it('should remove the popover from the DOM', () => {
					setupAndOpen();

					directive.handleMouseLeave();

					popover = document.querySelector('.ob-popover-content');
					expect(popover).toBeNull();
				});
			});
		});
	});

	describe('with OBLIQUE_POPOVER_TOGGLE_HANDLE set to hover', () => {
		beforeEach(() => {
			TestBed.overrideProvider(OBLIQUE_POPOVER_TOGGLE_HANDLE, {useValue: ObEToggleType.HOVER});

			globalSetup();
		});

		describe('toggle', () => {
			afterEach(() => {
				jest.useRealTimers();
			});

			describe('with toggleHandle input not set', () => {
				it("should call open if there's no popover", () => {
					jest.spyOn(directive, 'open');
					directive.close();
					toggle.click();
					expect(directive.open).not.toHaveBeenCalled();
				});

				it("should call close if there's a popover", () => {
					jest.spyOn(directive, 'close');
					directive.open();
					toggle.click();
					expect(directive.close).not.toHaveBeenCalled();
				});
			});

			describe('with toggleHandle input set to click', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.CLICK;
					directive.ngOnChanges();
				});

				it("should call open if there's no popover", () => {
					jest.spyOn(directive, 'open');
					directive.close();
					toggle.click();
					expect(directive.open).toHaveBeenCalled();
				});

				it("should call close if there's a popover", () => {
					jest.spyOn(directive, 'close');
					directive.open();
					toggle.click();
					expect(directive.close).toHaveBeenCalled();
				});
			});

			describe('with toggleHandle input set to hover', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.HOVER;
					directive.ngOnChanges();
				});

				it("should call open if there's no popover", () => {
					jest.spyOn(directive, 'open');
					directive.close();
					toggle.click();
					expect(directive.open).not.toHaveBeenCalled();
				});

				it("should call close if there's a popover", () => {
					jest.spyOn(directive, 'close');
					directive.open();
					toggle.click();
					expect(directive.close).not.toHaveBeenCalled();
				});
			});
		});

		describe('handleMouseEnter', () => {
			afterEach(() => {
				jest.useRealTimers();
			});

			describe('with toggleHandle input not set', () => {
				beforeEach(() => {
					toggleWithMouseEnter();
				});

				it('should insert the popover', () => {
					expect(popover).toBeTruthy();
				});

				it('should have an id', () => {
					expect(/popover-\d+-content/.test(popover.getAttribute('id'))).toBe(true);
				});

				it('should have the tooltip role', () => {
					expect(popover.getAttribute('role')).toBe('tooltip');
				});

				it('should have an arrow', () => {
					expect(popover.querySelector('.ob-popover-arrow')).toBeTruthy();
				});
			});

			describe('with toggleHandle input set to click', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.CLICK;
					toggleWithMouseEnter();
				});

				it('should not insert the popover', () => {
					expect(popover).toBeFalsy();
				});
			});

			describe('with toggleHandle input set to hover', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.HOVER;
					toggleWithMouseEnter();
				});

				it('should insert the popover', () => {
					expect(popover).toBeTruthy();
				});

				it('should have an id', () => {
					expect(/popover-\d+-content/.test(popover.getAttribute('id'))).toBe(true);
				});

				it('should have the tooltip role', () => {
					expect(popover.getAttribute('role')).toBe('tooltip');
				});

				it('should have an arrow', () => {
					expect(popover.querySelector('.ob-popover-arrow')).toBeTruthy();
				});
			});
		});

		describe('handleMouseLeave', () => {
			afterEach(() => {
				jest.useRealTimers();
			});

			describe('with toggleHandle input not set', () => {
				it('should not throw an error when closed before opened', () => {
					directive.handleMouseLeave();

					expect(true).toBe(true);
				});

				it('should remove the popover from the DOM', () => {
					setupAndOpen();

					directive.handleMouseLeave();

					popover = document.querySelector('.ob-popover-content');
					expect(popover).toBeNull();
				});
			});

			describe('with toggleHandle input set to click', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.CLICK;
					directive.ngOnChanges();
				});

				it('should not throw an error when closed before opened', () => {
					directive.handleMouseLeave();

					expect(true).toBe(true);
				});

				it('should not remove the popover from the DOM', () => {
					setupAndOpen();

					directive.handleMouseLeave();

					popover = document.querySelector('.ob-popover-content');
					expect(popover).toBeTruthy();
				});
			});

			describe('with toggleHandle input set to hover', () => {
				beforeEach(() => {
					directive.toggleHandle = ObEToggleType.HOVER;
					directive.ngOnChanges();
				});

				it('should not throw an error when closed before opened', () => {
					directive.handleMouseLeave();

					expect(true).toBe(true);
				});

				it('should remove the popover from the DOM', () => {
					setupAndOpen();

					directive.handleMouseLeave();

					popover = document.querySelector('.ob-popover-content');
					expect(popover).toBeNull();
				});
			});
		});
	});

	describe('with OBLIQUE_POPOVER_CLOSE_ONLY_ON_TOGGLE set to false', () => {
		beforeEach(() => {
			TestBed.overrideProvider(OBLIQUE_POPOVER_CLOSE_ONLY_ON_TOGGLE, {useValue: false});

			globalSetup();
		});

		describe('with closeOnlyOnToggle input not set', () => {
			describe('events', () => {
				beforeEach(() => {
					jest.spyOn(directive, 'close');
					jest.useFakeTimers();
					directive.open();
					jest.runOnlyPendingTimers();
					popover = document.querySelector('.ob-popover-content');
				});

				afterEach(() => {
					jest.useRealTimers();
				});

				it('should not close the popover upon click on the popover', () => {
					popover.click();
					expect(directive.close).not.toHaveBeenCalled();
				});

				it('should close the popover upon click on body', () => {
					document.querySelector('body').click();
					expect(directive.close).toHaveBeenCalled();
				});

				it('should close the popover on Escape hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
					expect(directive.close).toHaveBeenCalled();
				});

				it('should not close the popover on Enter hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
					expect(directive.close).not.toHaveBeenCalled();
				});
			});
		});

		describe('with closeOnlyOnToggle input set to false', () => {
			beforeEach(() => {
				directive.closeOnlyOnToggle = false;
				directive.ngOnChanges();
			});

			describe('events', () => {
				beforeEach(() => {
					jest.spyOn(directive, 'close');
					jest.useFakeTimers();
					directive.open();
					jest.runOnlyPendingTimers();
					popover = document.querySelector('.ob-popover-content');
				});

				afterEach(() => {
					jest.useRealTimers();
				});

				it('should not close the popover upon click on the popover', () => {
					popover.click();
					expect(directive.close).not.toHaveBeenCalled();
				});

				it('should close the popover upon click on body', () => {
					document.querySelector('body').click();
					expect(directive.close).toHaveBeenCalled();
				});

				it('should close the popover on Escape hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
					expect(directive.close).toHaveBeenCalled();
				});

				it('should not close the popover on Enter hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
					expect(directive.close).not.toHaveBeenCalled();
				});
			});
		});

		describe('with closeOnlyOnToggle input set to true', () => {
			beforeEach(() => {
				directive.closeOnlyOnToggle = true;
				directive.ngOnChanges();
			});

			describe('events', () => {
				beforeEach(() => {
					jest.spyOn(directive, 'close');
					jest.useFakeTimers();
					directive.open();
					jest.runOnlyPendingTimers();
					popover = document.querySelector('.ob-popover-content');
				});

				afterEach(() => {
					jest.useRealTimers();
				});

				it('should not close the popover upon click on the popover', () => {
					popover.click();
					expect(directive.close).not.toHaveBeenCalled();
				});

				it('should not close the popover upon click on body', () => {
					document.querySelector('body').click();
					expect(directive.close).not.toHaveBeenCalled();
				});

				it('should not close the popover on Escape hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
					expect(directive.close).not.toHaveBeenCalled();
				});

				it('should not close the popover on Enter hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
					expect(directive.close).not.toHaveBeenCalled();
				});
			});
		});
	});

	describe('with OBLIQUE_POPOVER_CLOSE_ONLY_ON_TOGGLE set to true', () => {
		beforeEach(() => {
			TestBed.overrideProvider(OBLIQUE_POPOVER_CLOSE_ONLY_ON_TOGGLE, {useValue: true});

			globalSetup();
		});

		describe('with closeOnlyOnToggle input not set', () => {
			describe('events', () => {
				beforeEach(() => {
					jest.spyOn(directive, 'close');
					jest.useFakeTimers();
					directive.open();
					jest.runOnlyPendingTimers();
					popover = document.querySelector('.ob-popover-content');
				});

				afterEach(() => {
					jest.useRealTimers();
				});

				it('should not close the popover upon click on the popover', () => {
					popover.click();
					expect(directive.close).not.toHaveBeenCalled();
				});

				it('should not close the popover upon click on body', () => {
					document.querySelector('body').click();
					expect(directive.close).not.toHaveBeenCalled();
				});

				it('should not close the popover on Escape hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
					expect(directive.close).not.toHaveBeenCalled();
				});

				it('should not close the popover on Enter hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
					expect(directive.close).not.toHaveBeenCalled();
				});
			});
		});

		describe('with closeOnlyOnToggle input set to false', () => {
			beforeEach(() => {
				directive.closeOnlyOnToggle = false;
				directive.ngOnChanges();
			});

			describe('events', () => {
				beforeEach(() => {
					jest.spyOn(directive, 'close');
					jest.useFakeTimers();
					directive.open();
					jest.runOnlyPendingTimers();
					popover = document.querySelector('.ob-popover-content');
				});

				afterEach(() => {
					jest.useRealTimers();
				});

				it('should not close the popover upon click on the popover', () => {
					popover.click();
					expect(directive.close).not.toHaveBeenCalled();
				});

				it('should close the popover upon click on body', () => {
					document.querySelector('body').click();
					expect(directive.close).toHaveBeenCalled();
				});

				it('should close the popover on Escape hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
					expect(directive.close).toHaveBeenCalled();
				});

				it('should not close the popover on Enter hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
					expect(directive.close).not.toHaveBeenCalled();
				});
			});
		});

		describe('with closeOnlyOnToggle input set to true', () => {
			beforeEach(() => {
				directive.closeOnlyOnToggle = true;
				directive.ngOnChanges();
			});

			describe('events', () => {
				beforeEach(() => {
					jest.spyOn(directive, 'close');
					jest.useFakeTimers();
					directive.open();
					jest.runOnlyPendingTimers();
					popover = document.querySelector('.ob-popover-content');
				});

				afterEach(() => {
					jest.useRealTimers();
				});

				it('should not close the popover upon click on the popover', () => {
					popover.click();
					expect(directive.close).not.toHaveBeenCalled();
				});

				it('should not close the popover upon click on body', () => {
					document.querySelector('body').click();
					expect(directive.close).not.toHaveBeenCalled();
				});

				it('should not close the popover on Escape hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
					expect(directive.close).not.toHaveBeenCalled();
				});

				it('should not close the popover on Enter hit', () => {
					document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
					expect(directive.close).not.toHaveBeenCalled();
				});
			});
		});
	});

	function globalSetup(): void {
		fixture = TestBed.createComponent(TestPopoverComponent);
		fixture.detectChanges();

		const element = fixture.debugElement.query(By.directive(ObPopoverDirective));
		directive = element.injector.get(ObPopoverDirective);
		toggle = element.nativeElement;
	}

	function setupAndOpen(): void {
		jest.useFakeTimers();
		directive.open();
		jest.runOnlyPendingTimers();
		popover = document.querySelector('.ob-popover-content');
	}

	function toggleWithMouseEnter(): void {
		jest.useFakeTimers();
		directive.ngOnChanges();
		directive.handleMouseEnter();
		jest.runOnlyPendingTimers();
		popover = document.querySelector('.ob-popover-content');
	}
});
