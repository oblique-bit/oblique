import {ObOutlineDirective} from './outline.directive';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';

@Component({
	template: `<ob-master-layout></ob-master-layout>`
})
class OutLineDirectiveTestComponent {}

describe('ObOutlineDirective', () => {
	let fixture: ComponentFixture<OutLineDirectiveTestComponent>;
	let directive: ObOutlineDirective;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [OutLineDirectiveTestComponent, ObOutlineDirective]
		}).compileComponents();

		fixture = TestBed.createComponent(OutLineDirectiveTestComponent);
		directive = fixture.debugElement.query(By.directive(ObOutlineDirective)).injector.get(ObOutlineDirective);
		fixture.detectChanges();

		jest.spyOn(document.body.classList, 'add');
		jest.spyOn(document.body.classList, 'remove');
		jest.spyOn(directive, 'addOutline');
		jest.spyOn(directive, 'removeOutline');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should be able to create the directive', () => {
		expect(directive).toBeTruthy();
	});

	it('should create an instance of the test component', () => {
		expect(fixture.componentInstance).toBeTruthy();
	});

	describe('Method addOutline', () => {
		beforeEach(() => {
			directive.addOutline();
		});

		it('should call document.body.classList.add once', () => {
			expect(document.body.classList.add).toHaveBeenCalledTimes(1);
		});

		it('should call document.body.classList.add with ob-outline', () => {
			expect(document.body.classList.add).toHaveBeenCalledWith('ob-outline');
		});
	});

	describe('Method removeOutline', () => {
		beforeEach(() => {
			directive.removeOutline();
		});

		it('should call document.body.classList.remove once', () => {
			expect(document.body.classList.remove).toHaveBeenCalledTimes(1);
		});

		it('should call document.body.classList.remove with ob-outline', () => {
			expect(document.body.classList.remove).toHaveBeenCalledWith('ob-outline');
		});
	});

	describe('Used in template', () => {
		describe.each(['tab', 'shift.tab', 'arrowUp', 'arrowDown', 'arrowRight', 'arrowLeft'])(`on press %s`, value => {
			it('should call addOutline once', () => {
				window.dispatchEvent(new KeyboardEvent('keydown', {key: value}));
				expect(directive.addOutline).toHaveBeenCalledTimes(1);
			});
		});

		describe.each(['enter', 'shift', 'lalt', 'space'])(`on press %s`, value => {
			it('should not call add addOutline', () => {
				window.dispatchEvent(new KeyboardEvent('keydown', {key: value}));
				expect(directive.addOutline).not.toHaveBeenCalled();
			});
		});

		describe.each([
			{eventName: 'mousedown', eventObject: new MouseEvent('mousedown')},
			{eventName: 'keydown', eventObject: new KeyboardEvent('keydown')}
		])('on $eventName', ({eventObject}) => {
			it('should call removeOutline once', () => {
				window.dispatchEvent(eventObject);
				expect(directive.removeOutline).toHaveBeenCalledTimes(1);
			});
		});
	});
});
