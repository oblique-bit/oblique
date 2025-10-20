import {ObtTourStateStoreService} from './tour-state-store.service';
import {ObtStoredTourData, ObtTour} from '../models/tour.model';

describe('ObtTourStateStoreService', () => {
	let service: ObtTourStateStoreService;
	let storageMock: Storage;

	beforeEach(() => {
		storageMock = {
			getItem: jest.fn(),
			setItem: jest.fn(),
			removeItem: jest.fn(),
			clear: jest.fn()
		} as unknown as Storage;

		Object.defineProperty(window, 'localStorage', {value: storageMock});
		service = new ObtTourStateStoreService();
	});

	describe('saveState', () => {
		const setKey = 'test-set';

		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should log error when tour is undefined', () => {
			const errorSpy = jest.spyOn(console, 'error').mockImplementation();
			service.saveState(setKey, undefined as unknown as ObtTour, 1, 'new');
			expect(errorSpy).toHaveBeenCalledWith('ObtTourStateStoreService: missing storageKey in tour config:', undefined);
		});

		it('should log error when storageKey is missing', () => {
			const errorSpy = jest.spyOn(console, 'error').mockImplementation();
			service.saveState(setKey, {tourTitle: 'Demo'} as ObtTour, 1, 'new');
			expect(errorSpy).toHaveBeenCalledWith('ObtTourStateStoreService: missing storageKey in tour config:', 'Demo');
		});

		it('should not call storage when storageKey is missing', () => {
			jest.spyOn(console, 'error').mockImplementation();
			service.saveState(setKey, {tourTitle: 'Demo'} as ObtTour, 2, 'done');
			expect(storageMock.setItem).not.toHaveBeenCalled();
		});

		it('should save valid state when storageKey exists', () => {
			const tour = {storageKey: 'key1', tourTitle: 'HasKey'} as ObtTour;
			const setSpy = jest.spyOn(storageMock, 'setItem');
			jest.spyOn<any, any>(service as any, 'loadAllStates').mockReturnValue({});
			service.saveState(setKey, tour, 2, 'done');
			expect(setSpy).toHaveBeenCalledWith(expect.stringContaining('test-set'), expect.stringContaining('"key1"'));
		});
	});

	describe('loadStoredTourStateData', () => {
		const setKey = 'set-1';

		it('should return stored data when key exists', () => {
			const mockData: Record<string, ObtStoredTourData> = {
				k1: {state: 'done', currentStepIndex: 1, timestamp: 123}
			};
			jest.spyOn<any, any>(service as any, 'loadAllStates').mockReturnValue(mockData);
			const result = service.loadStoredTourStateData(setKey, 'k1');
			expect(result).toEqual(mockData.k1);
		});

		it('should return null when key not found', () => {
			jest.spyOn<any, any>(service as any, 'loadAllStates').mockReturnValue({});
			const result = service.loadStoredTourStateData(setKey, 'missing');
			expect(result).toBeNull();
		});
	});

	describe('clearState', () => {
		it('should call removeItem with built storage key', () => {
			const removeSpy = jest.spyOn(storageMock, 'removeItem');
			service.clearState('set-A');
			expect(removeSpy).toHaveBeenCalledWith(expect.stringContaining('set-A'));
		});
	});

	describe('loadAllStates', () => {
		const setKey = 'set-B';

		it('should parse JSON when data exists', () => {
			const raw = '{"abc":{"state":"new","currentStepIndex":0,"timestamp":111}}';
			(storageMock.getItem as jest.Mock).mockReturnValue(raw);
			const result = (service as any).loadAllStates(setKey);
			expect(result).toEqual(JSON.parse(raw));
		});

		it('should return empty object when no data found', () => {
			(storageMock.getItem as jest.Mock).mockReturnValue(null);
			const result = (service as any).loadAllStates(setKey);
			expect(result).toEqual({});
		});
	});

	describe('buildStorageKey', () => {
		it('should create formatted key with prefix and suffix', () => {
			const result = (service as any).buildStorageKey('demo');
			expect(result).toContain('demo');
			expect(result.startsWith('obt-tour')).toBe(true);
			expect(result.endsWith('states')).toBe(true);
		});

		it('should trim whitespace in setKey', () => {
			const result = (service as any).buildStorageKey('  demo  ');
			expect(result).toBe(result.trim());
		});
	});
});
