import {ObOutlineDirective} from './outline.directive';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';

@Component({
	template: `<ob-master-layout />`
})
class OutLineDirectiveTestComponent {}

describe(ObOutlineDirective.name, () => {
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

	test('that creation works', () => {
		expect(directive).toBeTruthy();
	});

	test('that it creates instance of the test component', () => {
		expect(fixture.componentInstance).toBeTruthy();
	});

	describe(`Method ${ObOutlineDirective.prototype.addOutline.name}`, () => {
		beforeEach(() => {
			directive.addOutline();
		});

		test('that it calls document.body.classList.add once', () => {
			expect(document.body.classList.add).toHaveBeenCalledTimes(1);
		});

		test('that it calls document.body.classList.add with ob-outline', () => {
			expect(document.body.classList.add).toHaveBeenCalledWith('ob-outline');
		});
	});

	describe(`Method ${ObOutlineDirective.prototype.removeOutline.name}`, () => {
		beforeEach(() => {
			directive.removeOutline();
		});

		test('that it calls document.body.classList.remove once', () => {
			expect(document.body.classList.remove).toHaveBeenCalledTimes(1);
		});

		test('that it calls document.body.classList.remove with ob-outline', () => {
			expect(document.body.classList.remove).toHaveBeenCalledWith('ob-outline');
		});
	});

	describe('Used in template', () => {
		describe.each(['tab', 'shift.tab', 'arrowUp', 'arrowDown', 'arrowRight', 'arrowLeft'])(`on press %s`, value => {
			test(`that it calls ${ObOutlineDirective.prototype.addOutline.name} once`, () => {
				window.dispatchEvent(new KeyboardEvent('keydown', {key: value}));
				expect(directive.addOutline).toHaveBeenCalledTimes(1);
			});
		});

		describe.each(['enter', 'shift', 'lalt', 'space'])(`on press %s`, value => {
			test(`that it does not call add ${ObOutlineDirective.prototype.addOutline.name}`, () => {
				window.dispatchEvent(new KeyboardEvent('keydown', {key: value}));
				expect(directive.addOutline).not.toHaveBeenCalled();
			});
		});

		describe.each([
			{eventName: 'mousedown', eventObject: new MouseEvent('mousedown')},
			{eventName: 'keydown', eventObject: new KeyboardEvent('keydown')}
		])('on $eventName', ({eventObject}) => {
			test(`that it calls ${ObOutlineDirective.prototype.removeOutline.name} once`, () => {
				window.dispatchEvent(eventObject);
				expect(directive.removeOutline).toHaveBeenCalledTimes(1);
			});
		});
	});
});
