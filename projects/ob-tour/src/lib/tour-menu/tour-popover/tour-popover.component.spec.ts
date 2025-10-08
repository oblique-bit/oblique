import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BrowserTestingModule} from '@angular/platform-browser/testing';
import {EventEmitter} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {TourPopoverComponent} from './tour-popover.component';

describe('TourPopoverComponent (Unit)', () => {
	let fixture: ComponentFixture<TourPopoverComponent>;
	let component: TourPopoverComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TourPopoverComponent, BrowserTestingModule, TranslateModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(TourPopoverComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('Lifecycle and Initialization', () => {
		it('should create the component', () => {
			expect(component).toBeTruthy();
		});

		it('should initialize inputs as empty arrays', () => {
			expect(component.newTours()).toEqual([]);
			expect(component.inProgressTours()).toEqual([]);
			expect(component.doneTours()).toEqual([]);
		});

		it('should initialize isOpen as false', () => {
			expect(component.isOpen()).toBe(false);
		});
	});

	describe('Output and Event Handling', () => {
		it('should emit closeEmitter when onClose() is called', () => {
			const emitSpy = jest.spyOn(component.closeEmitter, 'emit');
			component.onClose();
			expect(emitSpy).toHaveBeenCalledTimes(1);
		});

		it('should define closeEmitter as an EventEmitter', () => {
			expect(component.closeEmitter).toBeInstanceOf(EventEmitter);
		});

		it('should emit closeEmitter multiple times if onClose called repeatedly', () => {
			const emitSpy = jest.spyOn(component.closeEmitter, 'emit');
			component.onClose();
			component.onClose();
			expect(emitSpy).toHaveBeenCalledTimes(2);
		});
	});

	describe('Keyboard Interaction', () => {
		it('should call onClose when Escape pressed and isOpen = true', () => {
			fixture.componentRef.setInput('isOpen', true);
			const event = new KeyboardEvent('keyup', {key: 'Escape'});
			const spy = jest.spyOn(component, 'onClose');
			component.onEscape(event);
			expect(spy).toHaveBeenCalled();
		});

		it('should prevent default on Escape when isOpen = true', () => {
			fixture.componentRef.setInput('isOpen', true);
			const event = new KeyboardEvent('keyup', {key: 'Escape'});
			const preventSpy = jest.spyOn(event, 'preventDefault');
			component.onEscape(event);
			expect(preventSpy).toHaveBeenCalled();
		});

		it('should not call onClose when Escape pressed and isOpen = false', () => {
			fixture.componentRef.setInput('isOpen', false);
			const event = new KeyboardEvent('keyup', {key: 'Escape'});
			const spy = jest.spyOn(component, 'onClose');
			component.onEscape(event);
			expect(spy).not.toHaveBeenCalled();
		});

		it('should not throw when Escape pressed while closed', () => {
			fixture.componentRef.setInput('isOpen', false);
			const event = new KeyboardEvent('keyup', {key: 'Escape'});
			expect(() => component.onEscape(event)).not.toThrow();
		});
	});
});
