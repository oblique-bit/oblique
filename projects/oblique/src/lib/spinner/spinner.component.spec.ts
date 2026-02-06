import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {Observable, Subject} from 'rxjs';
import {ObISpinnerEvent} from './spinner.model';
import {ObSpinnerComponent} from './spinner.component';
import {ObSpinnerService} from './spinner.service';
import {skip} from 'rxjs/operators';
import {provideObliqueTestingConfiguration} from '../utilities';

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
			providers: [{provide: ObSpinnerService, useValue: mockObSpinnerService}, provideObliqueTestingConfiguration()],
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
			{
				desc: 'active fixed',
				active: true,
				fixed: true,
				state: 'in',
				inert: true,
				announce: 'i18n.oblique.spinner.is-fixed.activate',
			},
			{
				desc: 'active floating',
				active: true,
				fixed: false,
				state: 'in',
				inert: true,
				announce: 'i18n.oblique.spinner.activate',
			},
			{
				desc: 'inactive fixed',
				active: false,
				fixed: true,
				state: 'out',
				inert: false,
				announce: 'i18n.oblique.spinner.deactivate',
			},
			{
				desc: 'inactive floating',
				active: false,
				fixed: true,
				state: 'out',
				inert: false,
				announce: 'i18n.oblique.spinner.deactivate',
			},
		])('$desc ObISpinnerEvent is emitted in the same channel', ({active, fixed, state, inert, announce}) => {
			let stateValue: string;
			let announcer: LiveAnnouncer;

			beforeEach(done => {
				announcer = TestBed.inject(LiveAnnouncer);
				jest.spyOn(announcer, 'announce');
				component.fixed = fixed;

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

			it('should announce', () => {
				expect(announcer.announce).toHaveBeenCalledWith(announce);
			});
		});
	});
});
