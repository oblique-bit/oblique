import {ObtTourService} from './tour.service';
import {ObtTourStateStoreService} from './tour-state-store.service';
import {ObtStoredTourData, ObtTour, ObtTourTrigger} from '../models/tour.model';
import {TestBed} from '@angular/core/testing';

describe('ObtTourService', () => {
	let service: ObtTourService;
	let stateStoreMock: jest.Mocked<ObtTourStateStoreService>;
	const mockDate = new Date('2025-10-22T00:00:00Z');

	let mockTour: ObtTour = {
		storageKey: 'tour-1',
		tourTitle: 'Test tour',
		tourDescription: 'Description',
		steps: [{title: 'Step 1'}, {title: 'Step 2'}] as any
	};

	beforeEach(() => {
		jest.useFakeTimers().setSystemTime(mockDate);

		stateStoreMock = {
			loadStoredTourStateData: jest.fn(),
			saveState: jest.fn(),
			clearState: jest.fn()
		} as unknown as jest.Mocked<ObtTourStateStoreService>;

		TestBed.configureTestingModule({
			providers: [ObtTourService, {provide: ObtTourStateStoreService, useValue: stateStoreMock}]
		});

		service = TestBed.inject(ObtTourService);
		service.menuKey = 'test-key';
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.useRealTimers();
	});

	describe('signals', () => {
		it('should initialize config() equals []', () => {
			expect(service.config()).toEqual([]);
		});

		it('should initialize activeTourKey() to be null', () => {
			expect(service.activeTourKey()).toBeNull();
		});

		it('should initialize activeStepIndex() to be null', () => {
			expect(service.activeStepIndex()).toBeNull();
		});
	});

	describe('activeTour', () => {
		it('should return null when config is empty', () => {
			service.config.set([]);
			service.activeTourKey.set('tour-1');
			expect(service.activeTour()).toBeNull();
		});

		it('should return null when key not found in config', () => {
			service.config.set([{...mockTour, storageKey: 'another'}]);
			service.activeTourKey.set('tour-1');
			expect(service.activeTour()).toBeNull();
		});

		it('should return the tour when key matches', () => {
			service.config.set([mockTour]);
			service.activeTourKey.set('tour-1');
			expect(service.activeTour()).toEqual(mockTour);
		});

		it('should return null when activeTourKey is undefined', () => {
			service.config.set([mockTour]);
			service.activeTourKey.set(undefined as any);
			expect(service.activeTour()).toBeNull();
		});
	});

	describe('activeStep', () => {
		beforeEach(() => {
			service.config.set([mockTour]);
			service.activeTourKey.set('tour-1');
		});

		it('should return null when no activeTourKey is set', () => {
			service.activeTourKey.set(null);
			expect(service.activeStep()).toBeNull();
		});

		it('should return null when activeStepIndex is null', () => {
			service.activeStepIndex.set(null);
			expect(service.activeStep()).toBeNull();
		});

		it('should return the first step when index is 0', () => {
			service.activeStepIndex.set(0);
			expect(service.activeStep()).toEqual(mockTour.steps[0]);
		});

		it('should return the second step when index is 1', () => {
			service.activeStepIndex.set(1);
			expect(service.activeStep()).toEqual(mockTour.steps[1]);
		});

		it('should return null when index is out of bounds', () => {
			service.activeStepIndex.set(5);
			expect(service.activeStep()).toBeUndefined();
		});
	});

	describe('constructor effect', () => {
		beforeEach(() => {
			service.config.set([mockTour]);
			service.activeTourKey.set('tour-1');
			service.activeStepIndex.set(0);
		});

		it('should not call saveState when no tour is active', () => {
			service.activeTourKey.set(null);
			service.activeStepIndex.set(null);
			service.state.set('inProgress');
			TestBed.tick();
			expect(stateStoreMock.saveState).not.toHaveBeenCalled();
		});

		it('should call saveState when active tour and step exist', () => {
			service.state.set('inProgress');
			TestBed.tick();
			expect(stateStoreMock.saveState).toHaveBeenCalledWith(
				'test-key',
				{state: 'new', steps: [], storageKey: 'tour-1', tourDescription: 'Description', tourTitle: 'Title'},
				0,
				'inProgress'
			);
		});

		it('should save last step index when state is done', () => {
			service.state.set('done');
			TestBed.tick();
			expect(stateStoreMock.saveState).toHaveBeenCalledWith(
				'test-key',
				{state: 'new', steps: [], storageKey: 'tour-1', tourDescription: 'Description', tourTitle: 'Title'},
				-1,
				'done'
			);
		});
	});

	describe('update', () => {
		const mockStored = {
			state: 'done' as const,
			currentStepIndex: 1,
			timestamp: 1234567890
		};

		mockTour = {
			storageKey: 'tour-1',
			tourTitle: 'Title',
			tourDescription: 'Description',
			steps: [],
			state: 'new' as const
		};

		beforeEach(() => {
			service.config.set([]);
			jest.spyOn(service as any, 'getTimestamp').mockReturnValue(1111);
		});

		it('should call saveState when no stored data exists', () => {
			stateStoreMock.loadStoredTourStateData.mockReturnValueOnce(null);
			service.update([mockTour]);
			expect(stateStoreMock.saveState).toHaveBeenCalledWith(
				'test-key',
				{state: 'new', steps: [], storageKey: 'tour-1', tourDescription: 'Description', tourTitle: 'Title'},
				0,
				'new'
			);
		});

		it('should use tour.state when no stored data exists and state is defined', () => {
			stateStoreMock.loadStoredTourStateData.mockReturnValueOnce(null);
			const custom = {...mockTour, state: 'inProgress' as const};
			service.update([custom]);
			expect(stateStoreMock.saveState).toHaveBeenCalledWith(
				'test-key',
				{state: 'inProgress', steps: [], storageKey: 'tour-1', tourDescription: 'Description', tourTitle: 'Title'},
				0,
				'inProgress'
			);
		});

		it('should not call saveState when stored data exists', () => {
			stateStoreMock.loadStoredTourStateData.mockReturnValueOnce(mockStored);
			service.update([mockTour]);
			expect(stateStoreMock.saveState).not.toHaveBeenCalled();
		});

		it('should use trigger from tour when defined', () => {
			stateStoreMock.loadStoredTourStateData.mockReturnValueOnce(mockStored);
			const custom = {...mockTour, trigger: 'manual' as ObtTourTrigger};
			service.update([custom]);
			expect(service.config()[0].trigger).toEqual('manual');
		});

		it('should set triggers to manual when undefined', () => {
			stateStoreMock.loadStoredTourStateData.mockReturnValueOnce(mockStored);
			service.update([mockTour]);
			expect(service.config()[0].trigger).toEqual('manual');
		});

		it('should use stored.state when available', () => {
			stateStoreMock.loadStoredTourStateData.mockReturnValueOnce(mockStored);
			service.update([mockTour]);
			expect(service.config()[0].state).toBe('done');
		});

		it('should fall back to tour.state when stored.state is missing', () => {
			stateStoreMock.loadStoredTourStateData.mockReturnValueOnce({
				...mockStored,
				state: undefined
			});
			service.update([mockTour]);
			expect(service.config()[0].state).toBe('new');
		});

		it('should fall back to "new" when neither stored.state nor tour.state exist', () => {
			stateStoreMock.loadStoredTourStateData.mockReturnValueOnce(undefined);
			const custom = {...mockTour, state: undefined};
			service.update([custom]);
			expect(service.config()[0].state).toBe('new');
		});

		it('should compute lastUpdated using getTimestamp()', () => {
			stateStoreMock.loadStoredTourStateData.mockReturnValueOnce(mockStored);
			service.update([mockTour]);
			expect((service as any).getTimestamp).toHaveBeenCalledWith(mockStored);
		});

		it('should update config with mapped tours', () => {
			stateStoreMock.loadStoredTourStateData.mockReturnValueOnce(mockStored);
			service.update([mockTour]);
			expect(service.config()[0].storageKey).toBe('tour-1');
		});
	});

	describe('startTour', () => {
		it('should set activeTourKey', () => {
			service.startTour('tour-1');
			expect(service.activeTourKey()).toBe('tour-1');
		});

		it('should set activeStepIndex to 0', () => {
			service.startTour('tour-1');
			expect(service.activeStepIndex()).toBe(0);
		});

		it('should set state to inProgress', () => {
			service.startTour('tour-1');
			expect(service.state()).toBe('inProgress');
		});
	});

	describe('nextStep', () => {
		const initialStepIndex = 0;

		beforeEach(() => {
			mockTour = {
				storageKey: 'tour-1',
				tourTitle: 'Test tour',
				tourDescription: 'Description',
				steps: [
					{stepTitle: 'Step 1', stepDescription: 'desc 1'},
					{stepTitle: 'Step 2', stepDescription: 'desc 2'}
				] as any
			};

			service.config.set([mockTour]);
			service.activeTourKey.set('tour-1');
			service.activeStepIndex.set(initialStepIndex);
			service.state.set('new');
		});

		it('should increment activeStepIndex by 1 when not on last step', () => {
			service.nextStep();
			expect(service.activeStepIndex()).toBe(initialStepIndex + 1);
		});

		it('should set state to "inProgress" when next step exists', () => {
			service.nextStep();
			expect(service.state()).toBe('inProgress');
		});

		it('should not change step index when on last step', () => {
			service.activeStepIndex.set(mockTour.steps.length - 1);
			service.nextStep();
			expect(service.activeStepIndex()).toBe(mockTour.steps.length - 1);
		});

		it('should not change anything when tour is null but idx is defined', () => {
			service.activeStepIndex.set(0);
			jest.spyOn(service, 'activeTour').mockReturnValue(null);
			const beforeState = service.state();
			service.nextStep();
			expect(service.state()).toBe(beforeState);
			expect(service.activeStepIndex()).toBe(0);
		});

		it('should not change anything when idx is null but tour is valid', () => {
			service.activeStepIndex.set(null);
			service.config.set([mockTour]);
			service.activeTourKey.set('tour-1');
			const beforeState = service.state();
			service.nextStep();
			expect(service.state()).toBe(beforeState);
			expect(service.activeStepIndex()).toBeNull();
		});

		it('should not change state when on last step', () => {
			service.activeStepIndex.set(mockTour.steps.length - 1);
			service.state.set('new');
			service.nextStep();
			expect(service.state()).toBe('new');
		});

		it('should not call any setters when all conditions are false (tour=null, idx=null, steps invalid)', () => {
			jest.spyOn(service, 'activeTour').mockReturnValue(null);
			service.activeStepIndex.set(null);
			const stepSpy = jest.spyOn(service.activeStepIndex, 'set');
			const stateSpy = jest.spyOn(service.state, 'set');

			expect(() => service.nextStep()).not.toThrow();
			expect(stepSpy).not.toHaveBeenCalled();
			expect(stateSpy).not.toHaveBeenCalled();
		});

		it('should not change index when activeStepIndex is null', () => {
			service.activeStepIndex.set(null);
			service.nextStep();
			expect(service.activeStepIndex()).toBeNull();
		});

		it('should not change state when activeStepIndex is null', () => {
			service.activeStepIndex.set(null);
			service.state.set('new');
			service.nextStep();
			expect(service.state()).toBe('new');
		});

		it('should not throw or change anything when tour is null', () => {
			jest.spyOn(service, 'activeTour').mockReturnValue(null);
			const beforeIndex = service.activeStepIndex();
			const beforeState = service.state();
			expect(() => service.nextStep()).not.toThrow();
			expect(service.activeStepIndex()).toBe(beforeIndex);
			expect(service.state()).toBe(beforeState);
		});

		it('should not change anything when tour.steps is null', () => {
			const invalidTour = {...mockTour, steps: null as any};
			service.config.set([invalidTour]);
			service.activeTourKey.set(invalidTour.storageKey);
			const stepSpy = jest.spyOn(service.activeStepIndex, 'set');
			service.nextStep();
			expect(stepSpy).not.toHaveBeenCalled();
			expect(service.state()).toBe('new');
		});

		it('should not change anything when tour.steps is empty array', () => {
			const emptyTour = {...mockTour, steps: []};
			service.config.set([emptyTour]);
			service.activeTourKey.set(emptyTour.storageKey);
			const stepSpy = jest.spyOn(service.activeStepIndex, 'set');
			service.nextStep();
			expect(stepSpy).not.toHaveBeenCalled();
			expect(service.state()).toBe('new');
		});

		it('should not call state.set("inProgress") when condition fails', () => {
			const stateSpy = jest.spyOn(service.state, 'set');
			jest.spyOn(service, 'activeTour').mockReturnValue(null);
			service.nextStep();
			expect(stateSpy).not.toHaveBeenCalledWith('inProgress');
		});
	});

	describe('prevStep', () => {
		beforeEach(() => {
			service.activeStepIndex.set(1);
		});

		it('should decrease step index by one', () => {
			service.prevStep();
			expect(service.activeStepIndex()).toBe(0);
		});

		it('should not go below 0', () => {
			service.activeStepIndex.set(0);
			service.prevStep();
			expect(service.activeStepIndex()).toBe(0);
		});

		it('should set state to inProgress when step decreases', () => {
			service.activeStepIndex.set(1);
			service.prevStep();
			expect(service.state()).toBe('inProgress');
		});
	});

	describe('finishTour', () => {
		beforeEach(() => {
			service.config.set([mockTour]);
			service.activeStepIndex.set(1);
		});

		it('should call saveState with done state', () => {
			service.finishTour('tour-1');
			expect(stateStoreMock.saveState).toHaveBeenCalledWith(
				'test-key',
				{
					steps: [
						{stepDescription: 'desc 1', stepTitle: 'Step 1'},
						{stepDescription: 'desc 2', stepTitle: 'Step 2'}
					],
					storageKey: 'tour-1',
					tourDescription: 'Description',
					tourTitle: 'Test tour'
				},
				1,
				'done'
			);
		});
		it('should call saveState with current index when tour exists', () => {
			service.finishTour('tour-1');
			expect(stateStoreMock.saveState).toHaveBeenCalledWith(
				'test-key',
				{
					steps: [
						{stepDescription: 'desc 1', stepTitle: 'Step 1'},
						{stepDescription: 'desc 2', stepTitle: 'Step 2'}
					],
					storageKey: 'tour-1',
					tourDescription: 'Description',
					tourTitle: 'Test tour'
				},
				1,
				'done'
			);
		});

		it('should use index 0 when activeStepIndex is null', () => {
			service.activeStepIndex.set(null);
			service.finishTour('tour-1');
			expect(stateStoreMock.saveState).toHaveBeenCalledWith(
				'test-key',
				{
					steps: [
						{stepDescription: 'desc 1', stepTitle: 'Step 1'},
						{stepDescription: 'desc 2', stepTitle: 'Step 2'}
					],
					storageKey: 'tour-1',
					tourDescription: 'Description',
					tourTitle: 'Test tour'
				},
				0,
				'done'
			);
		});

		it('should not call saveState when tour does not exist', () => {
			service.finishTour('unknown-key');
			expect(stateStoreMock.saveState).not.toHaveBeenCalled();
		});

		it('should set state to done', () => {
			service.finishTour('tour-1');
			expect(service.state()).toBe('done');
		});

		it('should call refreshConfigAfterStateChange', () => {
			const refreshSpy = jest.spyOn<any, any>(service as any, 'refreshConfigAfterStateChange');
			service.finishTour('tour-1');
			expect(refreshSpy).toHaveBeenCalled();
		});

		it('should call closeTour after finishing', () => {
			const closeSpy = jest.spyOn(service, 'closeTour');
			service.finishTour('tour-1');
			expect(closeSpy).toHaveBeenCalled();
		});
		it('should set state to done', () => {
			service.finishTour('tour-1');
			expect(service.state()).toBe('done');
		});

		it('should clear activeStepIndex', () => {
			service.finishTour('tour-1');
			expect(service.activeStepIndex()).toBeNull();
		});

		it('should clear activeTourKey', () => {
			service.finishTour('tour-1');
			expect(service.activeTourKey()).toBeNull();
		});
		it('should call saveState with current index when tour exists', () => {
			service.skipTour('tour-1');
			expect(stateStoreMock.saveState).toHaveBeenCalledWith(
				'test-key',
				{
					steps: [
						{stepDescription: 'desc 1', stepTitle: 'Step 1'},
						{stepDescription: 'desc 2', stepTitle: 'Step 2'}
					],
					storageKey: 'tour-1',
					tourDescription: 'Description',
					tourTitle: 'Test tour'
				},
				1,
				'skipped'
			);
		});

		it('should use index 0 when activeStepIndex is null', () => {
			service.activeStepIndex.set(null);
			service.skipTour('tour-1');
			expect(stateStoreMock.saveState).toHaveBeenCalledWith(
				'test-key',
				{
					steps: [
						{stepDescription: 'desc 1', stepTitle: 'Step 1'},
						{stepDescription: 'desc 2', stepTitle: 'Step 2'}
					],
					storageKey: 'tour-1',
					tourDescription: 'Description',
					tourTitle: 'Test tour'
				},
				0,
				'skipped'
			);
		});

		it('should not call saveState when tour does not exist', () => {
			service.activeTourKey.set('unknown');
			service.skipTour('unknown');
			expect(stateStoreMock.saveState).not.toHaveBeenCalled();
		});

		it('should set state first to skipped', () => {
			service.skipTour('tour-1');
			expect(service.state()).toBeNull();
		});

		it('should reset state to null after skip', () => {
			service.skipTour('tour-1');
			expect(service.state()).toBeNull();
		});

		it('should call closeTour after skipping', () => {
			const closeSpy = jest.spyOn(service, 'closeTour');
			service.skipTour('tour-1');
			expect(closeSpy).toHaveBeenCalled();
		});

		it('should update tour state when stored data exists', () => {
			stateStoreMock.loadStoredTourStateData.mockReturnValueOnce({
				state: 'done',
				currentStepIndex: 1,
				timestamp: 123
			});
			(service as any).refreshConfigAfterStateChange();
			expect(service.config()[0].state).toBe('done');
		});

		it('should set state to "new" when stored.state is undefined', () => {
			stateStoreMock.loadStoredTourStateData.mockReturnValueOnce({
				state: undefined,
				currentStepIndex: 1,
				timestamp: 123
			});
			(service as any).refreshConfigAfterStateChange();
			expect(service.config()[0].state).toBe('new');
		});

		it('should leave tour unchanged when no stored data exists', () => {
			stateStoreMock.loadStoredTourStateData.mockReturnValueOnce(null);
			(service as any).refreshConfigAfterStateChange();
			expect(service.config()[0]).toEqual(mockTour);
		});

		it('should call config.set with updated tours array', () => {
			const setSpy = jest.spyOn(service.config, 'set');
			stateStoreMock.loadStoredTourStateData.mockReturnValueOnce({
				state: 'inProgress',
				currentStepIndex: 0,
				timestamp: 123
			});
			(service as any).refreshConfigAfterStateChange();
			expect(setSpy).toHaveBeenCalledWith(expect.any(Array));
		});
	});

	describe('skipTour', () => {
		beforeEach(() => {
			service.config.set([mockTour]);
			service.activeStepIndex.set(0);
			service.activeTourKey.set('tour-1');
		});

		it('should call saveState with skipped', () => {
			service.skipTour('tour-1');
			expect(stateStoreMock.saveState).toHaveBeenCalledWith(
				'test-key',
				{
					steps: [
						{stepDescription: 'desc 1', stepTitle: 'Step 1'},
						{stepDescription: 'desc 2', stepTitle: 'Step 2'}
					],
					storageKey: 'tour-1',
					tourDescription: 'Description',
					tourTitle: 'Test tour'
				},
				0,
				'skipped'
			);
		});

		it('should set state to null after skip', () => {
			service.skipTour('tour-1');
			expect(service.state()).toBeNull();
		});

		it('should clear activeStepIndex', () => {
			service.skipTour('tour-1');
			expect(service.activeStepIndex()).toBeNull();
		});

		it('should clear activeTourKey', () => {
			service.skipTour('tour-1');
			expect(service.activeTourKey()).toBeNull();
		});
	});

	describe('pauseTour', () => {
		it('should reset activeStepIndex', () => {
			service.activeStepIndex.set(1);
			service.pauseTour();
			expect(service.activeStepIndex()).toBeNull();
		});

		it('should reset activeTourKey', () => {
			service.activeTourKey.set('tour-1');
			service.pauseTour();
			expect(service.activeTourKey()).toBeNull();
		});

		it('should set state to inProgress before pause', () => {
			service.pauseTour();
			expect(service.state()).toBe('inProgress');
		});
	});

	describe('restartTour', () => {
		it('should call startTour', () => {
			const startSpy = jest.spyOn(service, 'startTour');
			service.restartTour('tour-1');
			expect(startSpy).toHaveBeenCalledWith('tour-1');
		});
	});

	describe('resumeIfPossible', () => {
		const stored: ObtStoredTourData = {
			state: 'inProgress',
			currentStepIndex: 1,
			timestamp: mockDate.getTime()
		};

		beforeEach(() => {
			stateStoreMock.loadStoredTourStateData.mockReturnValue(stored);
			service.config.set([mockTour]);
		});

		it('should return early when no matching tour found', () => {
			service.config.set([]);
			// noinspection JSVoidFunctionReturnValueUsed
			const result = service.resumeIfPossible('invalid-key');
			expect(result).toBeUndefined();
		});

		it('should not call loadStoredTourStateData when tour not found', () => {
			service.config.set([]);
			service.resumeIfPossible('unknown');
			expect(stateStoreMock.loadStoredTourStateData).not.toHaveBeenCalled();
		});

		it('should not update any signals when tour not found', () => {
			service.config.set([]);
			service.resumeIfPossible('unknown');
			expect(service.activeTourKey()).toBeNull();
		});

		it('should set activeTourKey from storageKey', () => {
			service.resumeIfPossible('tour-1');
			expect(service.activeTourKey()).toBe('tour-1');
		});

		it('should set activeStepIndex from stored data', () => {
			service.resumeIfPossible('tour-1');
			expect(service.activeStepIndex()).toBe(1);
		});

		it('should set state from stored data', () => {
			service.resumeIfPossible('tour-1');
			expect(service.state()).toBe('inProgress');
		});

		it('should call refreshConfigAfterStateChange after restoring state', () => {
			const refreshSpy = jest.spyOn(service as any, 'refreshConfigAfterStateChange');
			service.resumeIfPossible('tour-1');
			expect(refreshSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('hasNextStep', () => {
		beforeEach(() => {
			mockTour = {
				storageKey: 'tour-1',
				tourTitle: 'Test tour',
				tourDescription: 'Description',
				steps: [
					{stepTitle: 'Step 1', stepDescription: 'desc 1'},
					{stepTitle: 'Step 2', stepDescription: 'desc 2'}
				] as any
			};
			service.config.set([mockTour]);
			service.activeTourKey.set(mockTour.storageKey);
		});

		it('should return true when next step exists', () => {
			service.activeStepIndex.set(0);
			expect(service.hasNextStep()).toBe(true);
		});

		it('should return false when on last step', () => {
			service.activeStepIndex.set(1);
			expect(service.hasNextStep()).toBe(false);
		});
	});

	describe('hasPreviousStep', () => {
		it('should return true when index > 0', () => {
			service.activeStepIndex.set(1);
			expect(service.hasPreviousStep()).toBe(true);
		});

		it('should return false when index = 0', () => {
			service.activeStepIndex.set(0);
			expect(service.hasPreviousStep()).toBe(false);
		});

		it('should return false when index is null', () => {
			service.activeStepIndex.set(null);
			expect(service.hasPreviousStep()).toBe(false);
		});
	});

	describe('clearLocalStorage', () => {
		beforeEach(() => {
			service.config.set([mockTour]);
		});

		it('should call clearState', () => {
			service.clearLocalStorage();
			expect(stateStoreMock.clearState).toHaveBeenCalled();
		});

		it('should reset activeStepIndex', () => {
			service.clearLocalStorage();
			expect(service.activeStepIndex()).toBeNull();
		});

		it('should reset activeTourKey', () => {
			service.clearLocalStorage();
			expect(service.activeTourKey()).toBeNull();
		});

		it('should set state to new', () => {
			service.clearLocalStorage();
			expect(service.state()).toBe('new');
		});
	});

	describe('getTimestamp', () => {
		const mockStored = {state: 'done', currentStepIndex: 1, timestamp: 1234567890};

		beforeEach(() => {
			jest.useFakeTimers().setSystemTime(new Date('2025-10-22T00:00:00Z'));
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('should return current Date.now() when state is "skipped"', () => {
			service.state.set('skipped');
			const result = (service as any).getTimestamp(mockStored);
			expect(result).toBe(Date.now());
		});

		it('should return current Date.now() when state is "done"', () => {
			service.state.set('done');
			const result = (service as any).getTimestamp(mockStored);
			expect(result).toBe(Date.now());
		});

		it('should return current Date.now() when state is "inProgress"', () => {
			service.state.set('inProgress');
			const result = (service as any).getTimestamp(mockStored);
			expect(result).toBe(Date.now());
		});

		it('should return stored timestamp when state is not active and stored value exists', () => {
			service.state.set('new');
			const result = (service as any).getTimestamp(mockStored);
			expect(result).toBe(mockStored.timestamp);
		});

		it('should return Date.now() when state is not active and stored timestamp is undefined', () => {
			service.state.set('new');
			const result = (service as any).getTimestamp(undefined);
			expect(result).toBe(Date.now());
		});
	});
});
