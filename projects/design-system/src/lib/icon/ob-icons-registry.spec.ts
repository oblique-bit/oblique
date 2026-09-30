import {beforeEach, describe, expect, test, vi} from 'vitest';
import type {iconsRegistry as IconsRegistry} from './ob-icons-registry';
import {accessibilityIcon, accommodationIcon, addressBookIcon} from '../icons';

describe('Icons Registry', () => {
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
		iconsRegistry.registerIcon(accessibilityIcon);
		const icons = iconsRegistry.getAllIconKeys();

		expect(iconsRegistry.getIcon('accessibility')).toBe(accessibilityIcon);
		expect(icons).toEqual([accessibilityIcon]);
	});

	test('Register multiple icons to the registry', () => {
		iconsRegistry.registerIcons([accessibilityIcon, accommodationIcon, addressBookIcon]);
		const icons = iconsRegistry.getAllIconKeys();

		expect(iconsRegistry.getIcon('accommodation')).toBe(accommodationIcon);
		expect(icons.length).toBe(3);
	});
});
