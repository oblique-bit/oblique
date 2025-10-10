import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {BrowserTestingModule} from '@angular/platform-browser/testing';
import {TranslateModule} from '@ngx-translate/core';
import {TourPopoverComponent} from './tour-popover.component';
import {ObTourServiceMock} from '../../services/_mock/tour-mock.service';
import {ObtTourService} from '../../services/tour.service';
import {ObTourConfig} from '../../models/tour-config.model';

describe('TourPopoverComponent (Unit)', () => {
	let fixture: ComponentFixture<TourPopoverComponent>;
	let component: TourPopoverComponent;
	let tourServiceMock: ObTourServiceMock;

	beforeEach(async () => {
		tourServiceMock = new ObTourServiceMock();

		await TestBed.configureTestingModule({
			imports: [TourPopoverComponent, BrowserTestingModule, TranslateModule.forRoot()],
			providers: [{provide: ObtTourService, useValue: tourServiceMock}]
		}).compileComponents();

		const mockConfig: ObTourConfig[] = [
			{
				tourTitle: 'testTourTitle',
				tourDescription: 'description',
				state: 'new',
				steps: []
			}
		];

		tourServiceMock.init(mockConfig);

		fixture = TestBed.createComponent(TourPopoverComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('Effect', () => {
		it('should call onClose by update if currentTour has value and isOpen = true', fakeAsync(() => {
			jest.spyOn(component, 'onClose');
			fixture.componentRef.setInput('isOpen', true);
			tourServiceMock.setActiveTour({
				tourTitle: 'title',
				tourDescription: 'Description',
				state: 'new',
				steps: []
			});
			fixture.detectChanges();
			TestBed.tick();
			expect(component.onClose).toHaveBeenCalledTimes(1);
		}));
	});

	describe('Output handling', () => {
		describe('onClose()', () => {
			it('should emit undefined as payload', fakeAsync(() => {
				const tour: ObTourConfig = {
					tourTitle: 'title',
					tourDescription: 'Description',
					state: 'new',
					steps: []
				};
				tourServiceMock.updateConfig.next([tour]);
				fixture.componentRef.setInput('isOpen', true);
				tourServiceMock.setActiveTour(tour);
				const emitSpy = jest.spyOn(component.closeEmitter, 'emit');
				tick();
				fixture.detectChanges();

				component.onClose();
				expect(emitSpy).toHaveBeenCalledWith();
			}));

			it('should emit when isOpen is true', () => {
				fixture.componentRef.setInput('isOpen', true);
				tourServiceMock.setActiveTour({
					tourTitle: 'title',
					tourDescription: 'Description',
					state: 'new',
					steps: []
				});
				fixture.detectChanges();
				const emitSpy = jest.spyOn(component.closeEmitter, 'emit');
				component.onClose();
				expect(emitSpy).toHaveBeenCalledTimes(1);
			});
		});

		describe.each([
			['called once', 1],
			['called twice', 2],
			['called three times', 3]
		])('multiple invocations (%calls)', (label, calls) => {
			beforeEach(() => {
				fixture.componentRef.setInput('isOpen', true);
				tourServiceMock.setActiveTour({
					tourTitle: 'title',
					tourDescription: 'Description',
					state: 'new',
					steps: []
				});
				fixture.detectChanges();
			});

			it(`should emit ${calls} times`, () => {
				const emitSpy = jest.spyOn(component.closeEmitter, 'emit');
				for (let index = 0; index < calls; index++) {
					component.onClose();
				}
				expect(emitSpy).toHaveBeenCalledTimes(calls);
			});
		});
	});

	describe('Keyboard handling (Escape)', () => {
		let onCloseSpy: jest.SpyInstance;
		let preventSpy: jest.Mock;
		let event: KeyboardEvent;

		beforeEach(() => {
			preventSpy = jest.fn();
			event = new KeyboardEvent('keyup', {key: 'Escape'});
			Object.defineProperty(event, 'preventDefault', {value: preventSpy});
		});

		describe('when isOpen is true', () => {
			beforeEach(() => {
				fixture.componentRef.setInput('isOpen', true);
				onCloseSpy = jest.spyOn(component, 'onClose');
			});

			it('should call preventDefault once', () => {
				component.onEscape(event);
				expect(preventSpy).toHaveBeenCalledTimes(1);
			});

			it('should call onClose once', () => {
				component.onEscape(event);
				expect(onCloseSpy).toHaveBeenCalledTimes(1);
			});
		});

		describe('when isOpen is false', () => {
			beforeEach(() => {
				fixture.componentRef.setInput('isOpen', false);
				onCloseSpy = jest.spyOn(component, 'onClose');
			});

			it('should not call preventDefault', () => {
				component.onEscape(event);
				expect(preventSpy).not.toHaveBeenCalled();
			});

			it('should not call onClose', () => {
				component.onEscape(event);
				expect(onCloseSpy).not.toHaveBeenCalled();
			});
		});

		describe('multiple Escape presses', () => {
			beforeEach(() => {
				fixture.componentRef.setInput('isOpen', true);
				onCloseSpy = jest.spyOn(component, 'onClose');
			});

			it('should call onClose twice for two keyups', () => {
				component.onEscape(event);
				component.onEscape(event);
				expect(onCloseSpy).toHaveBeenCalledTimes(2);
			});
		});
	});
});
