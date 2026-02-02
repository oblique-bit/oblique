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
	jest.spyOn(console, 'error').mockImplementation(() => {});
	jest.spyOn(console, 'warn').mockImplementation(() => {});
	jest.spyOn(console, 'info').mockImplementation(() => {});
});
/* eslint-enable @typescript-eslint/no-empty-function */

global.ResizeObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
}));

Object.defineProperty(window, 'localStorage', {value: mock()});
Object.defineProperty(window, 'sessionStorage', {value: mock()});
Object.defineProperty(window, 'scrollIntoView', {value: mock()});
Object.defineProperty(window, 'getComputedStyle', {
	value: () => ['-webkit-appearance'],
});
// eslint-disable-next-line @typescript-eslint/no-empty-function
(window as any).HTMLElement.prototype.scrollIntoView = function () {};
