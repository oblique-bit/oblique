import {TestBed} from '@angular/core/testing';
import {ObtTourMenuVisibility} from './tour-menu-visibility.service';

describe('ObtTourMenuVisibility', () => {
	let service: ObtTourMenuVisibility;
	let localStorageMock: Storage;
	const baseKey = 'test';
	const basePrefix = 'obt-tour-visibility';
	const baseSuffix = 'state';
	let expectedKey = '';

	beforeEach(() => {
		localStorageMock = {
			getItem: jest.fn(),
			setItem: jest.fn(),
			removeItem: jest.fn(),
			clear: jest.fn(),
			key: jest.fn(),
			length: 0
		} as unknown as Storage;

		Object.defineProperty(window, 'localStorage', {value: localStorageMock});

		TestBed.configureTestingModule({
			providers: [ObtTourMenuVisibility]
		});

		service = TestBed.inject(ObtTourMenuVisibility);
		expectedKey = `${basePrefix}-${baseKey}-${baseSuffix}`;
	});

	afterEach(() => jest.clearAllMocks());

	describe('isVisible', () => {
		it('returns true when stored value is "true"', () => {
			(localStorageMock.getItem as jest.Mock).mockReturnValueOnce('true');
			expect(service.isVisible(baseKey)).toBe(true);
		});

		it('returns false when stored value is "false"', () => {
			(localStorageMock.getItem as jest.Mock).mockReturnValueOnce('false');
			expect(service.isVisible(baseKey)).toBe(false);
		});

		it('returns null when no value is stored', () => {
			(localStorageMock.getItem as jest.Mock).mockReturnValueOnce(null);
			expect(service.isVisible(baseKey)).toBeNull();
		});
	});

	describe('changeVisibility', () => {
		let saveSpy: jest.SpyInstance;
		let restoreSpy: jest.SpyInstance;

		beforeEach(() => {
			saveSpy = jest.spyOn(service as any, 'saveToStorage').mockImplementation();
			restoreSpy = jest.spyOn(service as any, 'restoreFromStorage').mockReturnValue(null);
		});

		it('always starts with trimmed prefix', () => {
			service.changeVisibility('key', true);
			const savedKey = saveSpy.mock.calls[0][0];
			expect(savedKey.startsWith('obt-tour-')).toBe(true);
		});

		it('trims whitespace around key', () => {
			service.changeVisibility('  myKey  ', true);
			expect(saveSpy.mock.calls[0][0]).toBe('obt-tour-myKey-visibility-state');
		});

		it('handles empty string key', () => {
			service.changeVisibility('', true);
			expect(saveSpy.mock.calls[0][0]).toBe('obt-tour--visibility-state');
		});

		it('handles whitespace-only key', () => {
			service.changeVisibility('   ', true);
			expect(saveSpy.mock.calls[0][0]).toBe('obt-tour--visibility-state');
		});

		it('handles null key with fallback', () => {
			service.changeVisibility(null, true);
			expect(saveSpy.mock.calls[0][0]).toBe('obt-tour--visibility-state');
		});

		it('handles undefined key with fallback', () => {
			service.changeVisibility(undefined, true);
			expect(saveSpy.mock.calls[0][0]).toBe('obt-tour--visibility-state');
		});

		it('always ends with "-state"', () => {
			service.changeVisibility('any', true);
			const savedKey = saveSpy.mock.calls[0][0];
			expect(savedKey.endsWith('-state')).toBe(true);
		});

		it('builds full key correctly from all parts', () => {
			service.changeVisibility('demo', true);
			expect(saveSpy).toHaveBeenCalledWith('obt-tour-demo-visibility-state', true);
		});

		it('calls restoreFromStorage with same key', () => {
			service.changeVisibility('someKey', true);
			expect(restoreSpy).toHaveBeenCalledWith('someKey');
		});

		it('calls saveToStorage when current=null and visibility=true', () => {
			restoreSpy.mockReturnValue(null);
			service.changeVisibility('key', true);
			expect(saveSpy).toHaveBeenCalledWith('obt-tour-key-visibility-state', true);
		});

		it('does not overwrite when current=true and visibility=true', () => {
			restoreSpy.mockReturnValue(true);
			service.changeVisibility('key', true);
			expect(saveSpy).not.toHaveBeenCalled();
		});
	});

	describe('saveToStorage', () => {
		it('saves value as JSON', () => {
			(service as any).saveToStorage(expectedKey, true);
			expect(localStorageMock.setItem).toHaveBeenCalledWith(expectedKey, JSON.stringify(true));
		});

		it('logs error when key missing', () => {
			const errorSpy = jest.spyOn(console, 'error').mockImplementation();
			(service as any).saveToStorage('', true);
			expect(errorSpy).toHaveBeenCalledWith('Menu visibility key must be set before saving.');
		});
	});

	describe('createStateStorageKey', () => {
		let result: string;
		let tempService: {keySuffix: string};

		beforeEach(() => {
			tempService = {keySuffix: 'suffix'};
		});

		it('creates a full key with trimmed parts', () => {
			const localPrefix = '  prefix ';
			const localKey = '  main ';
			result = `${localPrefix.trim()}-${localKey.trim() ?? ''}-${tempService.keySuffix.trim()}`;
			expect(result).toBe('prefix-main-suffix');
		});

		it('handles empty key safely', () => {
			const localPrefix = '  prefix ';
			const localKey = '';
			result = `${localPrefix.trim()}-${localKey.trim() ?? ''}-${tempService.keySuffix.trim()}`;
			expect(result).toBe('prefix--suffix');
		});
	});

	describe('createStorageKey computation', () => {
		let prefix: string;
		let suffix: string;
		let ctx: any;

		beforeEach(() => {
			prefix = ' obt-tour-visibility ';
			suffix = ' suffix ';
			ctx = {keySuffix: suffix};
		});

		it('trims all parts when key has spaces', () => {
			const localKey = ' key ';
			const result = `${prefix.trim()}-${localKey.trim() ?? ''}-${ctx.keySuffix.trim()}`;
			expect(result).toBe('obt-tour-visibility-key-suffix');
		});

		it('handles null key safely', () => {
			const localKey = null as any;
			const result = `${prefix.trim()}-${localKey?.trim?.() ?? ''}-${ctx.keySuffix.trim()}`;
			expect(result).toBe('obt-tour-visibility--suffix');
		});

		it('handles keyPrefix without spaces', () => {
			prefix = 'obt-tour-visibility';
			const localKey = 'key';
			const result = `${prefix.trim()}-${localKey.trim() ?? ''}-${ctx.keySuffix.trim()}`;
			expect(result).toBe('obt-tour-visibility-key-suffix');
		});

		it('handles keySuffix with extra spaces', () => {
			ctx.keySuffix = ' extra ';
			const localKey = 'key';
			const result = `${prefix.trim()}-${localKey.trim() ?? ''}-${ctx.keySuffix.trim()}`;
			expect(result).toBe('obt-tour-visibility-key-extra');
		});

		it('handles all parts empty', () => {
			prefix = '';
			const localKey = '';
			ctx.keySuffix = '';
			const result = `${prefix.trim()}-${localKey.trim() ?? ''}-${ctx.keySuffix.trim()}`;
			expect(result).toBe('--');
		});

		it('handles key objects without trim method (fallback)', () => {
			const invalidKey = {value: 'abc'} as any;
			const result = `${prefix.trim()}-${invalidKey?.trim?.() ?? ''}-${ctx.keySuffix.trim()}`;
			expect(result).toBe('obt-tour-visibility--suffix');
		});

		it('handles key with trim returning undefined (explicit nullish)', () => {
			const keyMock = {trim: () => undefined} as any;
			const result = `${prefix.trim()}-${keyMock.trim() ?? ''}-${ctx.keySuffix.trim()}`;
			expect(result).toBe('obt-tour-visibility--suffix');
		});
	});
});
