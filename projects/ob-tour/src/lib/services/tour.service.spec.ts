import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ObtTourService} from './tour.service';
import {ObTourConfig, ObtToursConfig} from '../models/tour-config.model';
import {ObTourStep} from '../models/tour-step.model';
import SpyInstance = jest.SpyInstance;

describe('ObTourService', () => {
	let service: ObtTourService;
	let tourConfig: ObtToursConfig;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				TranslateModule.forRoot({
					defaultLanguage: 'en',
					loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}
				})
			]
		});
		service = TestBed.inject(ObtTourService);
		tourConfig = {
			tours: [
				{
					tourTitle: 'DemoTour',
					tourDescription: 'Example tour',
					steps: [
						{stepTitle: 'Step 1', stepDescription: 'Desc 1'} as ObTourStep,
						{stepTitle: 'Step 2', stepDescription: 'Desc 2'} as ObTourStep
					],
					storageKey: 'demoTourKey',
					triggers: [{type: 'manual'}],
					state: 'new'
				}
			]
		};
	});

	describe('init()', () => {
		let updateSpy: SpyInstance<void, [value: ObTourConfig[]]>;

		beforeEach(() => {
			updateSpy = jest.spyOn(service.updateConfig, 'next');
			service.init(tourConfig.tours);
		});

		it('should update configuration', () => {
			expect(updateSpy).toHaveBeenCalledWith(tourConfig.tours);
		});

		it('should reset activeTourTitle and activeStepIndex', () => {
			service.startTour('DemoTour');
			service.finishTour();
			expect((service as any).activeTourTitle()).toBeNull();
		});
	});

	describe('startTour()', () => {
		beforeEach(() => {
			service.init(tourConfig.tours);
		});

		it('should start the tour and set first step index', () => {
			service.startTour('DemoTour');
			expect((service as any).activeStepIndex()).toBe(0);
		});

		it('should not start if no config is available', () => {
			(service as any).config.set(null);
			service.startTour();
			expect((service as any).activeTourTitle()).toBeNull();
		});

		it('should start the first tour if no title is provided', () => {
			service.startTour();
			expect((service as any).activeTourTitle()).toBe('DemoTour');
		});

		it('should start the tour with matching title if it exists', () => {
			const anotherTour: ObTourConfig = {
				tourTitle: 'SecondTour',
				tourDescription: 'Tour for testing title selection',
				steps: [{stepTitle: 'Step X', stepDescription: 'Desc X'}],
				storageKey: 'secondTourKey',
				triggers: [{type: 'manual'}],
				state: 'new'
			};
			service.init([...tourConfig.tours, anotherTour]);
			service.startTour('SecondTour');
			expect((service as any).activeTourTitle()).toBe('SecondTour');
		});

		it('should not start a tour without steps', () => {
			const emptyTour: ObTourConfig = {
				tourTitle: 'EmptyTour',
				tourDescription: 'No steps available',
				steps: [],
				storageKey: 'emptyTourKey',
				triggers: [{type: 'manual'}],
				state: 'new'
			};
			service.init([emptyTour]);
			service.startTour('EmptyTour');
			expect((service as any).activeTourTitle()).toBeNull();
		});

		it('should not start a tour if the tour object is null', () => {
			(service as any).config.set([null]);
			service.startTour('NonExistingTour');
			expect((service as any).activeTourTitle()).toBeNull();
		});

		it('should not start a tour if the steps property is null', () => {
			const invalidTour: any = {
				tourTitle: 'InvalidTour',
				tourDescription: 'Steps property is null',
				steps: null,
				storageKey: 'invalidTourKey',
				triggers: [{type: 'manual'}],
				state: 'new'
			};
			service.init([invalidTour]);
			service.startTour('InvalidTour');
			expect((service as any).activeTourTitle()).toBeNull();
		});

		it('should not start a tour if steps array is empty', () => {
			const emptyStepsTour: ObTourConfig = {
				tourTitle: 'EmptyStepsTour',
				tourDescription: 'Steps array is empty',
				steps: [],
				storageKey: 'emptyStepsKey',
				triggers: [{type: 'manual'}],
				state: 'new'
			};
			service.init([emptyStepsTour]);
			service.startTour('EmptyStepsTour');
			expect((service as any).activeTourTitle()).toBeNull();
		});
	});

	describe('step navigation', () => {
		beforeEach(() => {
			service.init(tourConfig.tours);
			service.startTour('DemoTour');
		});

		it('should have next step if not last', () => {
			expect(service.hasNextStep()).toBe(true);
		});

		it('should not have next step if at last step', () => {
			service.nextStep();
			expect(service.hasNextStep()).toBe(false);
		});

		it('should have previous step after first step', () => {
			service.nextStep();
			expect(service.hasPreviousStep()).toBe(true);
		});

		it('should not have previous step at index 0', () => {
			expect(service.hasPreviousStep()).toBe(false);
		});

		it('should move to next step when available', () => {
			service.nextStep();
			expect((service as any).activeStepIndex()).toBe(1);
		});

		it('should move to previous step when available', () => {
			service.nextStep();
			service.prevStep();
			expect((service as any).activeStepIndex()).toBe(0);
		});
	});

	describe('finishTour()', () => {
		beforeEach(() => {
			service.init(tourConfig.tours);
			service.startTour('DemoTour');
			service.finishTour();
		});

		it('should clear activeTourTitle', () => {
			expect((service as any).activeTourTitle()).toBeNull();
		});

		it('should clear activeStepIndex', () => {
			expect((service as any).activeStepIndex()).toBeNull();
		});
	});

	describe('currentStep signal', () => {
		beforeEach(() => {
			service.init(tourConfig.tours);
			service.startTour('DemoTour');
		});

		it('should return correct current step', () => {
			expect(service.currentStep()?.stepTitle).toBe('Step 1');
		});

		it('should return next step after navigation', () => {
			service.nextStep();
			expect(service.currentStep()?.stepTitle).toBe('Step 2');
		});

		it('should return null when finished', () => {
			service.finishTour();
			expect(service.currentStep()).toBeNull();
		});
	});

	describe('activeTour', () => {
		beforeEach(() => {
			service.init([
				{
					tourTitle: 'DemoTour',
					tourDescription: 'First tour',
					steps: [{stepTitle: 'A', stepDescription: 'Step A'}],
					storageKey: 'demoTourKey',
					triggers: [{type: 'manual'}],
					state: 'new'
				},
				{
					tourTitle: 'OtherTour',
					tourDescription: 'Second tour',
					steps: [{stepTitle: 'B', stepDescription: 'Step B'}],
					storageKey: 'otherTourKey',
					triggers: [{type: 'manual'}],
					state: 'new'
				}
			]);
		});

		it('should return the matching tour when title exists', () => {
			(service as any).activeTourTitle.set('OtherTour');
			const activeTour = service.activeTour();
			expect(activeTour?.tourTitle).toBe('OtherTour');
		});

		it('should return null when title does not exist', () => {
			(service as any).activeTourTitle.set('UnknownTour');
			const activeTour = service.activeTour();
			expect(activeTour).toBeNull();
		});

		it('should return null when list is null', () => {
			(service as any).config.set(null);
			(service as any).activeTourTitle.set('DemoTour');
			const activeTour = service.activeTour();
			expect(activeTour).toBeNull();
		});

		it('should return null when title is null', () => {
			(service as any).activeTourTitle.set(null);
			const activeTour = service.activeTour();
			expect(activeTour).toBeNull();
		});
	});

	describe('findTour()', () => {
		beforeEach(() => {
			service.init([
				{
					tourTitle: 'FirstTour',
					tourDescription: 'Tour 1',
					steps: [{stepTitle: '1', stepDescription: 'First step'}],
					storageKey: 'key1',
					triggers: [{type: 'manual'}],
					state: 'new'
				},
				{
					tourTitle: 'SecondTour',
					tourDescription: 'Tour 2',
					steps: [{stepTitle: '2', stepDescription: 'Second step'}],
					storageKey: 'key2',
					triggers: [{type: 'manual'}],
					state: 'new'
				}
			]);
		});

		it('should return the matching tour when title exists', () => {
			const result = (service as any).findTour('SecondTour');
			expect(result?.tourTitle).toBe('SecondTour');
		});

		it('should return the first tour if title is not provided', () => {
			const result = (service as any).findTour();
			expect(result?.tourTitle).toBe('FirstTour');
		});

		it('should return null if title is not found', () => {
			const result = (service as any).findTour('UnknownTour');
			expect(result).toBeNull();
		});

		it('should return null if list is empty', () => {
			(service as any).config.set([]);
			const result = (service as any).findTour();
			expect(result).toBeNull();
		});

		it('should return null if config is null', () => {
			(service as any).config.set(null);
			const result = (service as any).findTour('SecondTour');
			expect(result).toBeNull();
		});

		it('should return the first tour when title exists but is undefined', () => {
			const result = (service as any).findTour(undefined);
			expect(result?.tourTitle).toBe('FirstTour');
		});

		it('should return null when list has no valid elements', () => {
			(service as any).config.set([null]);
			const result = (service as any).findTour();
			expect(result).toBeNull();
		});
	});

	describe('nextStep()', () => {
		beforeEach(() => {
			service.init([
				{
					tourTitle: 'NextStepTour',
					tourDescription: 'Tour to test nextStep method',
					steps: [
						{stepTitle: 'Step 1', stepDescription: 'First'},
						{stepTitle: 'Step 2', stepDescription: 'Second'}
					],
					storageKey: 'nextStepKey',
					triggers: [{type: 'manual'}],
					state: 'new'
				}
			]);
			service.startTour('NextStepTour');
		});

		it('should increase the active step index by one when next step exists', () => {
			service.nextStep();
			expect((service as any).activeStepIndex()).toBe(1);
		});

		it('should not change the active step index when already at last step', () => {
			(service as any).activeStepIndex.set(1);
			service.nextStep();
			expect((service as any).activeStepIndex()).toBe(1);
		});

		it('should not throw an error when no active tour exists', () => {
			service.finishTour();
			expect(() => service.nextStep()).not.toThrow();
		});

		it('should not change index when no tour is started', () => {
			service.finishTour();
			service.nextStep();
			expect((service as any).activeStepIndex()).toBeNull();
		});

		it('should not throw when config is null', () => {
			(service as any).config.set(null);
			expect(() => service.nextStep()).not.toThrow();
		});

		it('should increase index from null to 1 when hasNextStep is true', () => {
			(service as any).activeStepIndex.set(null);
			// Wir simulieren einen gültigen Tourzustand
			(service as any).hasNextStep = jest.fn(() => true);
			service.nextStep();
			expect((service as any).activeStepIndex()).toBe(1);
		});

		it('should not change index when steps are empty', () => {
			(service as any).config.set([
				{
					tourTitle: 'EmptyTour',
					tourDescription: 'No steps available',
					steps: [],
					storageKey: 'emptyTourKey',
					triggers: [{type: 'manual'}],
					state: 'new'
				}
			]);
			service.startTour('EmptyTour');
			service.nextStep();
			expect((service as any).activeStepIndex()).toBe(0);
		});

		it('should not change index when steps are null', () => {
			const invalidTour: any = {
				tourTitle: 'NullStepsTour',
				tourDescription: 'Steps property is null',
				steps: null,
				storageKey: 'nullStepsKey',
				triggers: [{type: 'manual'}],
				state: 'new'
			};
			(service as any).config.set([invalidTour]);
			(service as any).activeStepIndex.set(null); // reset before start
			service.startTour('NullStepsTour');
			service.nextStep();
			expect((service as any).activeStepIndex()).toBeNull();
		});
	});

	describe('prevStep()', () => {
		beforeEach(() => {
			service.init([
				{
					tourTitle: 'PrevStepTour',
					tourDescription: 'Tour to test prevStep method',
					steps: [
						{stepTitle: 'Step 1', stepDescription: 'First'},
						{stepTitle: 'Step 2', stepDescription: 'Second'},
						{stepTitle: 'Step 3', stepDescription: 'Third'}
					],
					storageKey: 'prevStepKey',
					triggers: [{type: 'manual'}],
					state: 'new'
				}
			]);
			service.startTour('PrevStepTour');
		});

		it('should decrease the active step index by one when previous step exists', () => {
			(service as any).activeStepIndex.set(2);
			service.prevStep();
			expect((service as any).activeStepIndex()).toBe(1);
		});

		it('should not change the active step index when already at first step', () => {
			(service as any).activeStepIndex.set(0);
			service.prevStep();
			expect((service as any).activeStepIndex()).toBe(0);
		});

		it('should not throw an error when no active tour exists', () => {
			service.finishTour();
			expect(() => service.prevStep()).not.toThrow();
		});

		it('should not change index when tour is finished', () => {
			service.finishTour();
			service.prevStep();
			expect((service as any).activeStepIndex()).toBeNull();
		});

		it('should not throw when config is null', () => {
			(service as any).config.set(null);
			expect(() => service.prevStep()).not.toThrow();
		});

		it('should decrease index from null to 0 when hasPreviousStep is true', () => {
			(service as any).activeStepIndex.set(null);
			(service as any).hasPreviousStep = jest.fn(() => true);
			service.prevStep();
			expect((service as any).activeStepIndex()).toBe(0);
		});

		it('should not change index when steps array is empty', () => {
			(service as any).config.set([
				{
					tourTitle: 'EmptyTour',
					tourDescription: 'No steps available',
					steps: [],
					storageKey: 'emptyPrevKey',
					triggers: [{type: 'manual'}],
					state: 'new'
				}
			]);
			service.startTour('EmptyTour');
			(service as any).activeStepIndex.set(0);
			service.prevStep();
			expect((service as any).activeStepIndex()).toBe(0);
		});

		it('should not change index when steps property is null', () => {
			const invalidTour: any = {
				tourTitle: 'NullStepsTour',
				tourDescription: 'Steps property is null',
				steps: null,
				storageKey: 'nullPrevKey',
				triggers: [{type: 'manual'}],
				state: 'new'
			};
			(service as any).config.set([invalidTour]);
			(service as any).activeStepIndex.set(null); // reset before start
			service.startTour('NullStepsTour');
			service.prevStep();
			expect((service as any).activeStepIndex()).toBeNull();
		});
	});
});
