import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {Observable, Subject} from 'rxjs';
import {ObISpinnerEvent} from './spinner.model';
import {ObSpinnerComponent} from './spinner.component';
import {ObSpinnerService} from './spinner.service';
import {provideObliqueTestingConfiguration} from '../utilities';

@Component({
	imports: [ObSpinnerComponent],
	template: `
		<button type="button" id="outside">outside</button>
		<div>
			<button type="button" id="inside">inside</button>
			<ob-spinner />
		</div>
	`,
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

	describe('property "isActive$"', () => {
		it('should be an Observable', () => {
			expect(component.isActive$ instanceof Observable).toBe(true);
		});

		it('should initially emit nothing', fakeAsync(() => {
			component.isActive$.subscribe(() => {
				fail('Should not emit anything');
			});
			tick();
		}));

		it('should not emit when an ObISpinnerEvent is emitted in another channel', fakeAsync(() => {
			let emitted = false;
			component.isActive$.subscribe(() => {
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
				isActive: true,
				inert: true,
				announce: 'i18n.oblique.spinner.is-fixed.activate',
			},
			{
				desc: 'active floating',
				active: true,
				fixed: false,
				isActive: true,
				inert: true,
				announce: 'i18n.oblique.spinner.activate',
			},
			{
				desc: 'inactive fixed',
				active: false,
				fixed: true,
				isActive: false,
				inert: false,
				announce: 'i18n.oblique.spinner.deactivate',
			},
			{
				desc: 'inactive floating',
				active: false,
				fixed: true,
				isActive: false,
				inert: false,
				announce: 'i18n.oblique.spinner.deactivate',
			},
		])('$desc ObISpinnerEvent is emitted in the same channel', ({active, fixed, isActive, inert, announce}) => {
			let stateValue: boolean;
			let announcer: LiveAnnouncer;

			beforeEach(done => {
				announcer = TestBed.inject(LiveAnnouncer);
				jest.spyOn(announcer, 'announce');
				component.fixed = fixed;

				component.isActive$.subscribe(value => {
					stateValue = value;
					done();
				});
				mockObSpinnerService.events$.next({active, channel: ObSpinnerService.CHANNEL});
			});

			it(`should emit "${isActive}"`, () => {
				expect(stateValue).toBe(isActive);
			});

			it('should toggle "inert" on the parent element', () => {
				expect(spinnerElement.parent.nativeElement.hasAttribute('inert')).toBe(inert);
			});

			it('should announce', () => {
				expect(announcer.announce).toHaveBeenCalledWith(announce);
			});
		});
	});

	describe('focus handling', () => {
		describe('focus is on the outside button when spinner is activated', () => {
			let outsideButton: HTMLButtonElement;
			let element: HTMLElement;

			beforeEach(done => {
				outsideButton = fixture.debugElement.query(By.css('#outside')).nativeElement;
				outsideButton.focus();

				component.isActive$.subscribe(() => {
					element = document.querySelector('.cdk-visually-hidden[tabindex="-1"]');
					done();
				});

				mockObSpinnerService.events$.next({active: true, channel: ObSpinnerService.CHANNEL});
			});

			test('no focusable element is created', () => {
				expect(element).toBeNull();
			});

			test('focus stays on the outside button', () => {
				expect(document.activeElement === outsideButton).toBe(true);
			});
		});

		describe.each([
			{desc: 'fixed', fixed: true, text: 'i18n.oblique.spinner.is-fixed.activate'},
			{desc: 'floating', fixed: false, text: 'i18n.oblique.spinner.activate'},
		])('focus is on the inside button when $desc spinner is activated', ({fixed, text}) => {
			let outsideButton: HTMLButtonElement;
			let insideButton: HTMLButtonElement;
			let element: HTMLElement;

			beforeEach(done => {
				outsideButton = fixture.debugElement.query(By.css('#outside')).nativeElement;
				insideButton = fixture.debugElement.query(By.css('#inside')).nativeElement;
				insideButton.focus();
				component.fixed = fixed;

				component.isActive$.subscribe(() => {
					element = document.querySelector('.cdk-visually-hidden[tabindex="-1"]');
					done();
				});

				mockObSpinnerService.events$.next({active: true, channel: ObSpinnerService.CHANNEL});
			});

			test('a focusable element is created', () => {
				expect(element).toBeTruthy();
			});

			test(`the focusable element contains the "${text}"`, () => {
				expect(element.textContent).toBe(text);
			});

			test('focus moved outside of the inert area', () => {
				expect(document.activeElement === element).toBe(true);
			});

			describe('spinner is deactivated without changing the focus', () => {
				beforeEach(done => {
					component.isActive$.subscribe(() => {
						element = document.querySelector('.cdk-visually-hidden[tabindex="-1"]');
						done();
					});

					mockObSpinnerService.events$.next({active: false, channel: ObSpinnerService.CHANNEL});
				});

				test('the focusable element is destroyed', () => {
					expect(element).toBeNull();
				});

				test('focus restored', () => {
					expect(document.activeElement === insideButton).toBe(true);
				});
			});

			describe('spinner is deactivated after the focus have been changed', () => {
				beforeEach(done => {
					outsideButton.focus();

					component.isActive$.subscribe(() => {
						element = document.querySelector('.cdk-visually-hidden[tabindex="-1"]');
						done();
					});

					mockObSpinnerService.events$.next({active: false, channel: ObSpinnerService.CHANNEL});
				});

				test('the focusable element is destroyed', () => {
					expect(element).toBeNull();
				});

				test('focus stays on the outside button', () => {
					expect(document.activeElement === outsideButton).toBe(true);
				});
			});
		});
	});
});
