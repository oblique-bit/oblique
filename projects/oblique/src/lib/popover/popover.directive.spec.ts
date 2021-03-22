import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {WINDOW} from '../utilities';
import {ObPopoverDirective} from './popover.directive';

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
		fixture = TestBed.createComponent(TestPopoverComponent);
		fixture.detectChanges();
		const element = fixture.debugElement.query(By.directive(ObPopoverDirective));
		directive = element.injector.get(ObPopoverDirective);
		toggle = element.nativeElement;
	});

	it('should create a fixture', () => {
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should be created', () => {
		expect(directive).toBeTruthy();
	});

	it('should have ob-popover class', () => {
		expect(toggle.classList.contains('ob-popover')).toBe(true);
	});

	it('should be hidden on start', () => {
		popover = document.querySelector('.ob-popover-content');
		expect(popover).toBeNull();
	});

	describe('toggle', () => {
		it('should show the popover', () => {
			toggle.click();
			popover = document.querySelector('.ob-popover-content');
			expect(popover).toBeTruthy();
		});
		it('should hide the popover', () => {
			toggle.click();
			toggle.click();
			popover = document.querySelector('.ob-popover-content');
			expect(popover).toBeNull();
		});
	});

	describe('open', () => {
		beforeEach(() => {
			directive.open();
			popover = document.querySelector('.ob-popover-content');
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
	});

	describe('outsideClick', () => {
		beforeEach(() => {
			directive.open();
			popover = document.querySelector('.ob-popover-content');
		});
		it('should not close the popover upon click', () => {
			popover.click();
			expect(popover).toBeTruthy();
		});
		it('should not close the popover upon click', () => {
			document.querySelector('body').click();
			expect(popover.querySelector('.ob-popover-arrow')).toBeTruthy();
		});
	});

	describe('with id', () => {
		it('should add the same id', () => {
			directive.id = 'popover';
			directive.ngOnInit();
			directive.open();
			popover = document.querySelector('.ob-popover-content');
			expect(popover.getAttribute('id')).toBe('popover-content');
		});
	});
});
