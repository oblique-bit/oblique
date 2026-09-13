import {beforeEach, describe, expect, test, vi} from 'vitest';
import type {iconsRegistry as IconsRegistry} from './ob-icons-registry';

describe('Icons Registry', () => {
	const mockIcons = [
		{key: 'mockIcon', svg: '<svg></svg>'},
		{key: 'mockIconAlt', svg: '<svg></svg>'},
		{key: 'mockIconEnd', svg: '<svg></svg>'},
	];
	let iconsRegistry: typeof IconsRegistry;

	// ensures that iconRegistry is reset on each test case
	beforeEach(async () => {
		vi.resetModules();
		iconsRegistry = (await import('./ob-icons-registry')).iconsRegistry;
	});

	test('The registry is initially empty', () => {
		const icons = iconsRegistry.getAllIconKeys();
		const icon = iconsRegistry.getIcon('someInvalidKey');
		expect(icons).toEqual([]);
		expect(icon).toBeNull();
	});

	test('Register one icon to the registry', () => {
		iconsRegistry.registerIcon(mockIcons[0]);
		const icons = iconsRegistry.getAllIconKeys();

		expect(iconsRegistry.getIcon('mockIcon')).toBe(mockIcons[0]);
		expect(icons).toEqual([mockIcons[0]]);
	});

	test('Register multiple icons to the registry', () => {
		iconsRegistry.reset();
		iconsRegistry.registerIcons(mockIcons);
		const icons = iconsRegistry.getAllIconKeys();

		expect(iconsRegistry.getIcon('mockIconAlt')).toBe(mockIcons[1]);
		expect(icons.length).toBe(3);
	});
});
