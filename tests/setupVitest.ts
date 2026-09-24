// eslint-disable-next-line max-classes-per-file
const mock = (): Partial<Storage> => {
	let storage: Record<string, string> = {};
	return {
		getItem: (key: string) => (key in storage ? storage[key] : null),
		setItem: (key: string, value: string) => {
			storage[key] = value || '';
		},
		removeItem: (key: string) => {
			delete storage[key];
		},
		clear: () => {
			storage = {};
		},
	};
};

/* eslint-disable @typescript-eslint/no-empty-function */
beforeAll(() => {
	vi.spyOn(console, 'error').mockImplementation(() => {});
	vi.spyOn(console, 'warn').mockImplementation(() => {});
	vi.spyOn(console, 'info').mockImplementation(() => {});
});
/* eslint-enable @typescript-eslint/no-empty-function */

class MockResizeObserver {
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
}
globalThis.ResizeObserver = MockResizeObserver;

globalThis.matchMedia ??= vi.fn().mockImplementation((query: string) => ({
	matches: false,
	media: query,
	onchange: null,
	addListener: vi.fn(),
	removeListener: vi.fn(),
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
	dispatchEvent: vi.fn(),
}));
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	configurable: true,
	value: globalThis.matchMedia,
});
Object.defineProperty(window, 'localStorage', {value: mock()});
Object.defineProperty(window, 'sessionStorage', {value: mock()});
Object.defineProperty(window, 'scrollIntoView', {value: mock()});
Object.defineProperty(window, 'getComputedStyle', {
	value: () => ['-webkit-appearance'],
});
Object.defineProperty(window, 'open', {value: vi.fn(), writable: true});

// eslint-disable-next-line @typescript-eslint/no-empty-function
(window as any).HTMLElement.prototype.scrollIntoView = function () {};

class MockCSSStyleSheet {
	cssText = '';

	replaceSync(cssText: string): void {
		this.cssText = cssText;
	}

	replace(cssText: string): this {
		this.cssText = cssText;
		return this;
	}
}

Object.defineProperty(globalThis, 'CSSStyleSheet', {
	writable: true,
	value: MockCSSStyleSheet,
});

Object.defineProperty(document, 'adoptedStyleSheets', {
	writable: true,
	value: [],
});
