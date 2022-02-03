const mock = (): Partial<Storage> => {
	let storage: Record<string, string> = {};
	return {
		getItem: (key: string) => (key in storage ? storage[key] : null),
		setItem: (key: string, value: string) => (storage[key] = value || ''),
		removeItem: (key: string) => delete storage[key],
		clear: () => (storage = {})
	};
};

/* eslint-disable @typescript-eslint/no-empty-function */
console.error = jest.fn().mockImplementation(() => {});
console.warn = jest.fn().mockImplementation(() => {});
console.info = jest.fn().mockImplementation(() => {});
/* eslint-enable @typescript-eslint/no-empty-function */

Object.defineProperty(window, 'localStorage', {value: mock()});
Object.defineProperty(window, 'sessionStorage', {value: mock()});
Object.defineProperty(window, 'scrollIntoView', {value: mock()});
Object.defineProperty(window, 'getComputedStyle', {
	value: () => ['-webkit-appearance']
});
// eslint-disable-next-line @typescript-eslint/no-empty-function
(window as any).HTMLElement.prototype.scrollIntoView = function () {};
Object.defineProperty(document.body.style, 'transform', {
	value: () => ({
		enumerable: true,
		configurable: true
	})
});
