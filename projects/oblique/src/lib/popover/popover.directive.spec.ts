import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {WINDOW} from '../utilities';
import {
	OBLIQUE_POPOVER_APPEND_TO_BODY,
	OBLIQUE_POPOVER_CLOSE_ONLY_ON_TOGGLE,
	OBLIQUE_POPOVER_TOGGLE_HANDLE,
	ObPopoverDirective
} from './popover.directive';
import {ObEToggleType} from './popover.model';

@Component({
	template: `
		<button type="button" [obPopover]="myPopover">Open Popover</button>
		<ng-template #myPopover>
			<p>Hello World</p>
		</ng-template>
	`
})
class TestPopoverComponent {}

describe('ObPopover', () => {
	let fixture: ComponentFixture<TestPopoverComponent>;
	let directive: ObPopoverDirective;
	let popover: HTMLElement;
	let toggle: HTMLElement;

	beforeEach(() => {
		// added useFakeTimers() here because many of the tests need it and it's easier to call it here once than calling it multiple times in each describe() with cleanup.
		// not added in a beforeAll() because not all issues could be resolved
		jest.useFakeTimers();
		TestBed.configureTestingModule({
			imports: [ObPopoverDirective],
			declarations: [TestPopoverComponent],
			providers: [{provide: WINDOW, useValue: window}],
			schemas: [NO_ERRORS_SCHEMA]
		});
	});

	describe('without injection tokens', () => {
		describe('without additional inputs', () => {
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

				it('should insert the popover', () => {
					expect(popover).toBeTruthy();
				});

				it('should insert the popover after the toggle', () => {
					expect(popover.previousSibling).toBe(toggle);
				});

				it('should not append the popover to the body', () => {
					expect(popover.parentNode).not.toBe(document.querySelector('body'));
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
					directive.open();
					jest.runOnlyPendingTimers();
					directive.close();
					// fixture.detectChanges();
					popover = document.querySelector('.ob-popover-content');
					expect(popover).toBeNull();
				});
			});

			describe('handleMouseEnter', () => {
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
				describe('with closeOnlyOnToggle input not set', () => {
					beforeEach(() => {
						jest.spyOn(directive, 'close');
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
					directive.open();
					jest.runOnlyPendingTimers();
					popover = document.querySelector('.ob-popover-content');
					expect(popover.getAttribute('id')).toBe('popover-content');
				});
			});

			describe('with a custom panelContentId', () => {
				it('should add the given panelContentId', () => {
					directive.panelContentId = 'custom-panel';
					directive.ngOnInit();
					directive.open();
					jest.runOnlyPendingTimers();
					popover = document.querySelector('.ob-popover-content');
					expect(popover.getAttribute('id')).toBe('custom-panel');
				});
			});
		});

		describe('with appendToBody input', () => {
			beforeEach(() => {
				TestBed.overrideTemplate(
					TestPopoverComponent,
					`
				<button type="button" [obPopover]="myPopover" [appendToBody]="true">Open Popover</button>
				<ng-template #myPopover>
					<p>Hello World</p>
				</ng-template>
			`
				);
				globalSetup();
				setupAndOpen();
			});

			describe('open', () => {
				it('should insert the popover', () => {
					expect(popover).toBeTruthy();
				});

				it('should not insert the popover after the toggle', () => {
					expect(popover.previousSibling).not.toBe(toggle);
				});

				it('should append the popover to the body', () => {
					expect(popover.parentNode).toBe(document.body);
				});
			});
		});
	});

	describe('with OBLIQUE_POPOVER_APPEND_TO_BODY set to click', () => {
		beforeEach(() => {
			TestBed.overrideProvider(OBLIQUE_POPOVER_APPEND_TO_BODY, {useValue: true});

			globalSetup();
		});

		describe('open', () => {
			beforeEach(() => {
				setupAndOpen();
			});

			it('should insert the popover', () => {
				expect(popover).toBeTruthy();
			});

			it('should not insert the popover after the toggle', () => {
				expect(popover.previousSibling).not.toBe(toggle);
			});

			it('should append the popover to the body', () => {
				expect(popover.parentNode).toBe(document.body);
			});
		});
	});

	describe('with OBLIQUE_POPOVER_TOGGLE_HANDLE set to click', () => {
		beforeEach(() => {
			TestBed.overrideProvider(OBLIQUE_POPOVER_TOGGLE_HANDLE, {useValue: ObEToggleType.CLICK});
			globalSetup();
		});

		describe('toggle', () => {
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
		});

		describe('with closeOnlyOnToggle input set to false', () => {
			beforeEach(() => {
				directive.closeOnlyOnToggle = false;
				directive.ngOnChanges();
			});

			describe('events', () => {
				beforeEach(() => {
					jest.spyOn(directive, 'close');
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
		});

		describe('with closeOnlyOnToggle input set to true', () => {
			beforeEach(() => {
				directive.closeOnlyOnToggle = true;
				directive.ngOnChanges();
			});

			describe('events', () => {
				beforeEach(() => {
					jest.spyOn(directive, 'close');
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

		describe('with closeOnlyOnToggle input set to false', () => {
			beforeEach(() => {
				directive.closeOnlyOnToggle = false;
				directive.ngOnChanges();
			});

			describe('events', () => {
				beforeEach(() => {
					jest.spyOn(directive, 'close');
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
		});

		describe('with closeOnlyOnToggle input set to true', () => {
			beforeEach(() => {
				directive.closeOnlyOnToggle = true;
				directive.ngOnChanges();
			});

			describe('events', () => {
				beforeEach(() => {
					jest.spyOn(directive, 'close');
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
	});

	function globalSetup(): void {
		fixture = TestBed.createComponent(TestPopoverComponent);
		fixture.detectChanges();

		const element = fixture.debugElement.query(By.directive(ObPopoverDirective));
		directive = element.injector.get(ObPopoverDirective);
		toggle = element.nativeElement;
	}

	function setupAndOpen(): void {
		directive.open();
		jest.runOnlyPendingTimers();
		popover = document.querySelector('.ob-popover-content');
	}

	function toggleWithMouseEnter(): void {
		directive.ngOnChanges();
		directive.handleMouseEnter();
		jest.runOnlyPendingTimers();
		popover = document.querySelector('.ob-popover-content');
	}
});
