import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {Observable, Subject} from 'rxjs';
import {ObISpinnerEvent} from './spinner.model';
import {ObSpinnerComponent} from './spinner.component';
import {ObSpinnerService} from './spinner.service';
import {skip} from 'rxjs/operators';

describe('ObSpinnerComponent', () => {
	let component: ObSpinnerComponent;
	let fixture: ComponentFixture<ObSpinnerComponent>;
	let mockObSpinnerService;

	beforeEach(() => {
		mockObSpinnerService = {events$: new Subject<ObISpinnerEvent>()};
		TestBed.configureTestingModule({
			declarations: [ObSpinnerComponent],
			providers: [{provide: ObSpinnerService, useValue: mockObSpinnerService}],
			imports: [BrowserAnimationsModule]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ObSpinnerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have "ob-spinner" class', () => {
		expect(fixture.debugElement.classes['ob-spinner']).toBe(true);
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
			{description: 'should remove "ob-overlay-fixed" class when not provided', state: undefined, result: undefined}
		])('$description', ({state, result}) => {
			component.fixed = state;
			fixture.detectChanges();
			expect(fixture.debugElement.query(By.css('.ob-overlay')).classes['ob-overlay-fixed']).toBe(result);
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

		it('should emit "in" when an active ObISpinnerEvent is emitted in the same channel', done => {
			// skip(1) is to ignore the `startWith`value
			component.state$.pipe(skip(1)).subscribe(value => {
				expect(value).toBe('in');
				done();
			});
			mockObSpinnerService.events$.next({active: true, channel: ObSpinnerService.CHANNEL});
		});

		it('should emit "out" when an active ObISpinnerEvent is emitted in the same channel', done => {
			// skip(1) is to ignore the `startWith`value
			component.state$.pipe(skip(1)).subscribe(value => {
				expect(value).toBe('out');
				done();
			});
			mockObSpinnerService.events$.next({active: false, channel: ObSpinnerService.CHANNEL});
		});

		it('should not emit when an ObISpinnerEvent is emitted in another channel', fakeAsync(() => {
			let emitted = false;
			// skip(1) is to ignore the `startWith`value
			component.state$.pipe(skip(1)).subscribe(() => (emitted = true));
			mockObSpinnerService.events$.next({active: true, channel: 'alt'});
			tick();
			expect(emitted).toBe(false);
		}));
	});
});
