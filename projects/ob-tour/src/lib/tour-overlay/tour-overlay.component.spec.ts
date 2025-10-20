import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TourOverlayComponent} from './tour-overlay.component';
import {ObtTourService} from '../services/tour.service';
import {ObtTourServiceMock, createObtTourServiceMock} from '../services/_mock/tour-mock.service';
import {axe} from 'jest-axe';
import {ObtTour} from '../models/tour.model';

describe('TourOverlayComponent', () => {
	let component: TourOverlayComponent;
	let fixture: ComponentFixture<TourOverlayComponent>;
	let tourServiceMock: ObtTourServiceMock;
	let updateStateSpy: jest.SpyInstance;

	const initialExpect = {
		percent: 0,
		activeStepNumber: 0,
		hasNextIndex: false,
		hasPreviousIndex: false,
		currentArrowPosition: 'arrow-none'
	};
	let activeTourSpy: jest.SpyInstance;
	let hasNextStepSpy: jest.SpyInstance;
	let hasPreviousStepSpy: jest.SpyInstance;

	beforeEach(async () => {
		tourServiceMock = createObtTourServiceMock();

		activeTourSpy = jest.spyOn(tourServiceMock, 'activeTour');
		hasNextStepSpy = jest.spyOn(tourServiceMock, 'hasNextStep');
		hasPreviousStepSpy = jest.spyOn(tourServiceMock, 'hasPreviousStep');

		updateStateSpy = jest.spyOn(TourOverlayComponent.prototype as any, 'updateState').mockImplementation();

		await TestBed.configureTestingModule({
			imports: [
				TourOverlayComponent,
				TranslateModule.forRoot({
					defaultLanguage: 'en',
					loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}
				})
			],
			providers: [{provide: ObtTourService, useValue: tourServiceMock}]
		}).compileComponents();

		fixture = TestBed.createComponent(TourOverlayComponent);
		component = fixture.componentInstance;
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});
	describe('initial values before effect runs', () => {
		it.each(Object.entries(initialExpect))('should initialize %s with %s', (key, value) => {
			expect((component as any)[key]).toBe(value);
		});
		it('should initialize tourLength to undefined', () => {
			expect((component as any).tourLength).toBeUndefined();
		});
	});

	describe.each([
		{
			description: 'with initial tour with 2 steps',
			mockTour: {
				storageKey: 'tour-1',
				tourTitle: 'Test tour',
				tourDescription: 'Description',
				steps: [{title: 'Step 1'}, {title: 'Step 2'}] as any
			} as ObtTour,
			expected: {tourLength: 2, hasTour: true}
		},
		{
			description: 'with initial tour without steps',
			mockTour: {
				storageKey: 'tour-empty',
				tourTitle: 'Empty tour',
				tourDescription: 'No steps',
				steps: [] as any
			} as ObtTour,
			expected: {tourLength: 0, hasTour: true}
		},
		{
			description: 'with initial tour undefined',
			mockTour: undefined,
			expected: {tourLength: 0, hasTour: false}
		},
		{
			description: 'with initial tour null',
			mockTour: null,
			expected: {tourLength: 0, hasTour: false}
		}
	])('Scenario: $description', ({mockTour, expected}) => {
		describe('with constructor and reactive effect', () => {
			beforeEach(async () => {
				activeTourSpy.mockReturnValue(mockTour);
				hasNextStepSpy.mockReturnValue(true);
				hasPreviousStepSpy.mockReturnValue(false);

				fixture.detectChanges();
				await fixture.whenStable();
				await fixture.whenRenderingDone();
			});
			afterEach(() => {
				jest.clearAllMocks();
			});

			it(`should assign currentTour to ${expected.hasTour ? 'mockTour' : 'null/undefined'}`, () => {
				if (expected.hasTour) {
					expect((component as any).currentTour).toEqual(mockTour);
				} else {
					expect((component as any).currentTour).toBeFalsy();
				}
			});

			it(`should set hasNextIndex = true from tourService.hasNextStep()`, () => {
				expect(component.hasNextIndex).toBe(true);
			});

			it(`should set hasPreviousIndex = false from tourService.hasPreviousStep()`, () => {
				expect(component.hasPreviousIndex).toBe(false);
			});

			it(`should set tourLength = ${expected.tourLength}`, () => {
				expect(component.tourStepsLength).toBe(expected.tourLength);
			});

			describe('Accessibility', () => {
				it('should have no basic accessibility violations (WCAG 2.1 AA)', async () => {
					const results = await axe(fixture.nativeElement);
					expect(results).toHaveNoViolations();
				});
			});

			describe('Keyboard handling (Escape)', () => {
				it('should call preventDefault when Escape is pressed', () => {
					const preventSpy = jest.fn();
					const event = new KeyboardEvent('keyup', {key: 'Escape'});
					Object.defineProperty(event, 'preventDefault', {value: preventSpy});
					document.dispatchEvent(event);
					expect(preventSpy).toHaveBeenCalledTimes(1);
				});
				it('should call onClose when Escape is pressed', () => {
					const onCloseSpy = jest.spyOn(component, 'onClose');
					const event = new KeyboardEvent('keyup', {key: 'Escape'});
					Object.defineProperty(event, 'preventDefault', {value: jest.fn()});
					document.dispatchEvent(event);
					expect(onCloseSpy).toHaveBeenCalledTimes(1);
				});
			});
		});
	});

	describe('methods', () => {
		describe('onNext()', () => {
			beforeEach(() => {
				jest.spyOn(component.closeEmitter, 'emit');
				jest.spyOn(component as any, 'updateState');
				jest.clearAllMocks();
				component.onNext();
			});

			afterEach(() => {
				jest.clearAllMocks();
			});

			it('should call closeEmitter.emit()', () => {
				expect(component.closeEmitter.emit).toHaveBeenCalledTimes(1);
			});

			it('should call updateState()', () => {
				expect((component as any).updateState).toHaveBeenCalledTimes(1);
			});

			it('should call tourService.nextStep()', () => {
				expect(tourServiceMock.nextStep).toHaveBeenCalledTimes(1);
			});
		});

		describe('onPrev', () => {
			beforeEach(() => {
				jest.spyOn(component.closeEmitter, 'emit');
				jest.spyOn(component as any, 'updateState');
				jest.clearAllMocks();
				component.onPrev();
			});

			afterEach(() => {
				jest.clearAllMocks();
			});

			it('should call closeEmitter.emit()', () => {
				expect(component.closeEmitter.emit).toHaveBeenCalledTimes(1);
			});

			it('should call updateState()', () => {
				expect((component as any).updateState).toHaveBeenCalledTimes(1);
			});

			it('should call tourService.prevStep()', () => {
				expect(tourServiceMock.prevStep).toHaveBeenCalledTimes(1);
			});
		});

		describe('onClose', () => {
			describe.each([
				{nextStep: true, shouldCallFinishTour: false, shouldCallPauseTour: true},
				{nextStep: false, shouldCallFinishTour: true, shouldCallPauseTour: false},
				{nextStep: undefined, shouldCallFinishTour: true, shouldCallPauseTour: false},
				{nextStep: null, shouldCallFinishTour: true, shouldCallPauseTour: false}
			])('onClose() with hasNextStep = $nextStep', ({nextStep, shouldCallFinishTour, shouldCallPauseTour}) => {
				beforeEach(() => {
					jest.clearAllMocks();
					hasNextStepSpy.mockReturnValue(nextStep);
					component.onClose();
				});

				it(`should ${shouldCallPauseTour ? '' : 'not '}call pauseTour() once`, () => {
					if (shouldCallPauseTour) {
						expect(tourServiceMock.pauseTour).toHaveBeenCalledTimes(1);
					} else {
						expect(tourServiceMock.pauseTour).not.toHaveBeenCalled();
					}
				});

				it(`should ${shouldCallFinishTour ? '' : 'not '}call finishTour() once`, () => {
					if (shouldCallFinishTour) {
						expect(tourServiceMock.finishTour).toHaveBeenCalledTimes(1);
					} else {
						expect(tourServiceMock.finishTour).not.toHaveBeenCalled();
					}
				});

				it('should always emit closeEmitter once', () => {
					const emitSpy = jest.spyOn((component as any).closeEmitter, 'emit');
					component.onClose();
					expect(emitSpy).toHaveBeenCalledTimes(1);
				});
			});
		});

		describe('updateState', () => {
			let resetStepSpy: jest.SpyInstance;
			let calcPercentSpy: jest.SpyInstance;
			let activeStepIndexSpy: jest.SpyInstance;
			let hasNextStepSpyLocal: jest.SpyInstance;
			let hasPreviousStepSpyLocal: jest.SpyInstance;

			beforeEach(() => {
				jest.clearAllMocks();
				updateStateSpy?.mockRestore?.();
				resetStepSpy = jest.spyOn(TourOverlayComponent.prototype as any, 'resetStep').mockImplementation();

				calcPercentSpy = jest.spyOn(component as any, 'calcPercent').mockReturnValue(42);

				activeStepIndexSpy = jest.spyOn((component as any).tourService, 'activeStepIndex').mockReturnValue(1);

				hasNextStepSpyLocal = jest.spyOn((component as any).tourService, 'hasNextStep').mockReturnValue(true);

				hasPreviousStepSpyLocal = jest.spyOn((component as any).tourService, 'hasPreviousStep').mockReturnValue(false);

				(component as any).currentTour = {steps: [{}, {}, {}]};
			});

			afterEach(() => {
				jest.clearAllMocks();
			});

			it('should call resetStep() and return early when currentTour is null', () => {
				(component as any).currentTour = null;
				(component as any).updateState();
				expect(resetStepSpy).toHaveBeenCalledTimes(1);
			});

			it('should use 0 as fallback when activeStepIndex() returns null', () => {
				activeStepIndexSpy.mockReturnValue(null);
				(component as any).updateState();
				expect((component as any).activeStepNumber).toBe(1);
			});

			it('should set activeStepNumber to idx + 1', () => {
				activeStepIndexSpy.mockReturnValue(2);
				(component as any).updateState();
				expect((component as any).activeStepNumber).toBe(3);
			});

			it('should set tourStepsLength to currentTour.steps.length', () => {
				(component as any).updateState();
				expect((component as any).tourStepsLength).toBe(3);
			});

			it('should set hasNextIndex from tourService.hasNextStep()', () => {
				(component as any).updateState();
				expect((component as any).hasNextIndex).toBe(true);
			});

			it('should set hasPreviousIndex from tourService.hasPreviousStep()', () => {
				(component as any).updateState();
				expect((component as any).hasPreviousIndex).toBe(false);
			});

			it('should call calcPercent() with tourStepsLength and activeStepNumber', () => {
				(component as any).updateState();
				expect(calcPercentSpy).toHaveBeenCalledWith(3, 2);
			});

			it('should set percent based on calcPercent() return value', () => {
				(component as any).updateState();
				expect((component as any).percent).toBe(42);
			});
		});

		describe('calcPercent', () => {
			it('should return 0 when maxValue is 0', () => {
				const result = (component as any).calcPercent(0, 5);
				expect(result).toBe(0);
			});
			it('should return 25 when maxValue is 4 and currentValue is 1', () => {
				const result = (component as any).calcPercent(4, 1);
				expect(result).toBe(25);
			});
			it('should return 100 when currentValue equals maxValue', () => {
				const result = (component as any).calcPercent(5, 5);
				expect(result).toBe(100);
			});
		});

		describe('resetStep()', () => {
			let arrowPositionSpy: jest.SpyInstance;
			beforeEach(() => {
				jest.restoreAllMocks();
				(component as any).tourStepsLength = 5;
				(component as any).percent = 50;
				(component as any).activeStepNumber = 3;
				(component as any).hasNextIndex = true;
				(component as any).hasPreviousIndex = true;
				(component as any).currentArrowPosition = 'arrow-top';
				arrowPositionSpy = jest.spyOn(component, 'arrowPosition').mockReturnValue('arrow-bottom');
				(component as any).resetStep();
			});

			it('should set tourStepsLength to 0', () => {
				expect((component as any).tourStepsLength).toBe(0);
			});

			it('should set percent to 0', () => {
				expect((component as any).percent).toBe(0);
			});

			it('should set activeStepNumber to 0', () => {
				expect((component as any).activeStepNumber).toBe(0);
			});

			it('should set hasNextIndex to false', () => {
				expect((component as any).hasNextIndex).toBe(false);
			});

			it('should set hasPreviousIndex to false', () => {
				expect((component as any).hasPreviousIndex).toBe(false);
			});

			it('should update currentArrowPosition using arrowPosition()', () => {
				expect((component as any).currentArrowPosition).toBe('arrow-bottom');
			});

			it('should call arrowPosition() exactly once', () => {
				expect(component.arrowPosition).toHaveBeenCalledTimes(1);
			});
		});
	});
});
