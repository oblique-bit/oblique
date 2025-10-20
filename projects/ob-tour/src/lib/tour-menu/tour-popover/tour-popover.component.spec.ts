import {ComponentFixture, TestBed, fakeAsync} from '@angular/core/testing';
import {BrowserTestingModule} from '@angular/platform-browser/testing';
import {TranslateModule} from '@ngx-translate/core';
import {TourPopoverComponent} from './tour-popover.component';
import {ObtTourServiceMock, createObtTourServiceMock} from '../../services/_mock/tour-mock.service';
import {ObtTourService} from '../../services/tour.service';
import {ObtTour, ObtToursConfig} from '../../models/tour.model';

describe('TourPopoverComponent', () => {
	let fixture: ComponentFixture<TourPopoverComponent>;
	let component: TourPopoverComponent;
	const tourServiceMock: ObtTourServiceMock = createObtTourServiceMock();

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TourPopoverComponent, BrowserTestingModule, TranslateModule.forRoot()],
			providers: [{provide: ObtTourService, useValue: tourServiceMock}]
		}).compileComponents();

		const mockConfig: ObtToursConfig = {
			tours: [
				{
					storageKey: 'tourKey33',
					tourTitle: 'title',
					tourDescription: 'Description',
					state: 'new',
					steps: []
				}
			]
		};
		tourServiceMock.update(mockConfig);

		fixture = TestBed.createComponent(TourPopoverComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('clearTours', () => {
		it('should call tourService.clearLocalStorage()', () => {
			component.clearTours();
			expect(tourServiceMock.clearLocalStorage).toHaveBeenCalled();
		});

		it('should emit cleared event', () => {
			const clearedSpy = jest.spyOn(component.cleared, 'emit');
			component.clearTours();
			expect(clearedSpy).toHaveBeenCalled();
		});

		it('should emit closed event', () => {
			const closedSpy = jest.spyOn(component.closed, 'emit');
			component.clearTours();
			expect(closedSpy).toHaveBeenCalled();
		});
	});

	describe('Output handling', () => {
		describe('onClose()', () => {
			it('should not emit when there is no active tour', () => {
				jest.spyOn(tourServiceMock, 'activeTour').mockReturnValue(null);
				const emitSpy = jest.spyOn(component.closed, 'emit');
				component.onClose();
				expect(emitSpy).not.toHaveBeenCalled();
			});

			it('should emit once when an active tour exists', async () => {
				jest.spyOn(tourServiceMock, 'activeTour').mockReturnValue({storageKey: 'tour-1'} as ObtTour);
				const emitSpy = jest.spyOn(component.closed, 'emit');
				fixture.detectChanges();
				await fixture.whenStable();
				component.onClose();
				fixture.detectChanges();
				await fixture.whenStable();
				expect(emitSpy).toHaveBeenCalledTimes(1);
			});

			it('should emit each time onClose() is called', async () => {
				jest.spyOn(tourServiceMock, 'activeTour').mockReturnValue({storageKey: 'tour-1'} as any);
				const emitSpy = jest.spyOn(component.closed, 'emit');
				fixture.detectChanges();
				await fixture.whenStable();
				component.onClose();
				component.onClose();
				fixture.detectChanges();
				await fixture.whenStable();
				expect(emitSpy).toHaveBeenCalledTimes(2);
			});

			it('should emit undefined as payload', fakeAsync(async () => {
				const tour: ObtToursConfig = {
					tours: [
						{
							tourTitle: 'title',
							tourDescription: 'Description',
							storageKey: 'key1',
							state: 'new',
							steps: []
						}
					]
				};
				tourServiceMock.update([tour]);
				fixture.componentRef.setInput('isOpen', true);
				tourServiceMock.activeTourKey.set(tour.tours[0].storageKey);
				const emitSpy = jest.spyOn(component.closed, 'emit');
				fixture.detectChanges();
				await fixture.whenStable();

				component.onClose();
				expect(emitSpy).toHaveBeenCalledWith();
			}));

			it('should emit when isOpen is true', () => {
				fixture.componentRef.setInput('isOpen', true);
				tourServiceMock.update({
					tours: [
						{
							tourTitle: 'title',
							tourDescription: 'Description',
							state: 'new',
							steps: []
						}
					]
				});
				fixture.detectChanges();
				const emitSpy = jest.spyOn(component.closed, 'emit');
				component.onClose();
				expect(emitSpy).toHaveBeenCalledTimes(1);
			});
		});

		describe.each([
			['called once', 1],
			['called twice', 2],
			['called three times', 3]
		])('multiple invocations (%calls)', (label, calls) => {
			beforeEach(async () => {
				fixture.componentRef.setInput('isOpen', true);
				tourServiceMock.update({
					tours: [
						{
							tourTitle: 'title',
							tourDescription: 'Description',
							state: 'new',
							steps: []
						}
					]
				});
				fixture.detectChanges();
				await fixture.whenStable();
			});

			it(`should emit ${calls} times`, () => {
				const emitSpy = jest.spyOn(component.closed, 'emit');
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
