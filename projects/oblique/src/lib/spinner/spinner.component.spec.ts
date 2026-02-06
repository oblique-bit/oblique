import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {Observable, Subject} from 'rxjs';
import {ObISpinnerEvent} from './spinner.model';
import {ObSpinnerComponent} from './spinner.component';
import {ObSpinnerService} from './spinner.service';
import {skip} from 'rxjs/operators';

@Component({
	imports: [ObSpinnerComponent],
	template: `<div><ob-spinner /></div>`,
})
class MockComponent {}

describe('ObSpinnerComponent', () => {
	let component: ObSpinnerComponent;
	let spinnerElement: DebugElement;
	let fixture: ComponentFixture<MockComponent>;
	let mockObSpinnerService;

	beforeEach(async () => {
		mockObSpinnerService = {events$: new Subject<ObISpinnerEvent>()};
		await TestBed.configureTestingModule({
			providers: [{provide: ObSpinnerService, useValue: mockObSpinnerService}],
			imports: [MockComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MockComponent);
		spinnerElement = fixture.debugElement.query(By.directive(ObSpinnerComponent));
		component = spinnerElement.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have "ob-spinner" class', () => {
		expect(spinnerElement.classes['ob-spinner']).toBe(true);
	});

	it('should have "aria-hidden" attribute', () => {
		expect(spinnerElement.attributes['aria-hidden']).toBe('true');
	});

	describe('property "channel"', () => {
		it('should not be initialized to "default"', () => {
			expect(component.channel).toBe('default');
		});
	});

	describe('property "fixed"', () => {
		it('should be initialized to "false"', () => {
			expect(component.fixed).toBe(false);
		});

		it.each([
			{description: 'should add "ob-overlay-fixed" class when set to true', state: true, result: true},
			{description: 'should remove "ob-overlay-fixed" class when set to false', state: false, result: undefined},
			{description: 'should remove "ob-overlay-fixed" class when not provided', state: undefined, result: undefined},
		])('$description', ({state, result}) => {
			component.fixed = state;
			fixture.detectChanges();
			expect(spinnerElement.query(By.css('.ob-overlay')).classes['ob-overlay-fixed']).toBe(result);
		});
	});

	describe('property "state$"', () => {
		it('should be an Observable', () => {
			expect(component.state$ instanceof Observable).toBe(true);
		});

		it('should initially emit "out"', done => {
			component.state$.subscribe(value => {
				expect(value).toBe('out');
				done();
			});
		});

		it('should not emit when an ObISpinnerEvent is emitted in another channel', fakeAsync(() => {
			let emitted = false;
			// skip(1) is to ignore the `startWith`value
			component.state$.pipe(skip(1)).subscribe(() => {
				emitted = true;
			});
			mockObSpinnerService.events$.next({active: true, channel: 'alt'});
			tick();
			expect(emitted).toBe(false);
		}));

		describe.each([
			{desc: 'active', active: true, state: 'in', inert: true},
			{desc: 'inactive', active: false, state: 'out', inert: false},
		])('$desc ObISpinnerEvent is emitted in the same channel', ({active, state, inert}) => {
			let stateValue: string;
			beforeEach(done => {
				// skip(1) is to ignore the `startWith`value
				component.state$.pipe(skip(1)).subscribe(value => {
					stateValue = value;
					done();
				});
				mockObSpinnerService.events$.next({active, channel: ObSpinnerService.CHANNEL});
			});

			it(`should emit "${state}"`, () => {
				expect(stateValue).toBe(state);
			});

			it('should toggle "inert" on the parent element', () => {
				expect(spinnerElement.parent.nativeElement.hasAttribute('inert')).toBe(inert);
			});
		});
	});
});
