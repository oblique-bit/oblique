import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {Subject} from 'rxjs';
import {ObISpinnerEvent} from './spinner.model';
import {ObSpinnerComponent} from './spinner.component';
import {ObSpinnerService} from './spinner.service';

describe('ObSpinnerComponent', () => {
	let component: ObSpinnerComponent;
	let fixture: ComponentFixture<ObSpinnerComponent>;
	const mockObSpinnerService = {events$: new Subject<ObISpinnerEvent>()};

	beforeEach(() => {
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

	describe('property "$state"', () => {
		it('should be initialized to "out"', () => {
			expect(component.$state).toBe('out');
		});

		it.each([
			{active: true, activeText: 'active', channel: ObSpinnerService.CHANNEL, channelText: 'the same', result: 'in'},
			{active: false, activeText: 'inactive', channel: ObSpinnerService.CHANNEL, channelText: 'the same', result: 'out'},
			{active: true, activeText: 'active', channel: 'alt', channelText: 'another', result: 'out'},
			{active: false, activeText: 'inactive', channel: 'alt', channelText: 'another', result: 'out'}
		])(
			'should be set to "$result" when an $activeText ObISpinnerEvent is emitted in $channelText channel',
			fakeAsync(({active, channel, result}) => {
				mockObSpinnerService.events$.next({active, channel});
				tick();
				expect(component.$state).toBe(result);
			})
		);

		it('should not changed after ngOnDestroy has been called', fakeAsync(() => {
			component.ngOnDestroy();
			mockObSpinnerService.events$.next({active: true, channel: ObSpinnerService.CHANNEL});
			tick();
			expect(component.$state).toBe('out');
		}));
	});
});
