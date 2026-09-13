import {beforeEach, describe, expect, test} from 'vitest';
import {html, render} from 'lit';
import {ObIcon} from './ob-icon';
import {iconsRegistry} from './ob-icons-registry';
import {accessibilityIcon} from '../icons';

describe(ObIcon.name, () => {
	describe('Renders semantic icon', () => {
		let container: HTMLDivElement;
		let element: ObIcon | null;

		beforeEach(async () => {
			iconsRegistry.registerIcon(accessibilityIcon);

			container = document.createElement('div');
			document.body.appendChild(container);

			render(html`<ob-icon key="accessibility" label="Accessibility"></ob-icon>`, container);

			element = container.querySelector<ObIcon>('ob-icon');
			await element?.updateComplete;
		});

		test('renders with the correct attributes', () => {
			const svg = element?.shadowRoot?.querySelector('svg');

			const id = svg?.getAttribute('id');
			const role = svg?.getAttribute('role');
			const ariaLabel = svg?.getAttribute('aria-label');
			const ariaHidden = svg?.getAttribute('aria-hidden');

			expect(svg).toBeTruthy();
			expect([id, role, ariaLabel, ariaHidden].filter(attr => attr)).toEqual(['accessibility', 'img', 'Accessibility']);
		});
	});

	describe('Renders non semantic icon', () => {
		let container: HTMLDivElement;
		let element: ObIcon | null;

		beforeEach(async () => {
			iconsRegistry.registerIcon(accessibilityIcon);

			container = document.createElement('div');
			document.body.appendChild(container);

			render(html`<ob-icon key="accessibility"></ob-icon>`, container);

			element = container.querySelector<ObIcon>('ob-icon');
			await element?.updateComplete;
		});

		test('renders with the correct attributes', () => {
			const svg = element?.shadowRoot?.querySelector('svg');

			const id = svg?.getAttribute('id');
			const role = svg?.getAttribute('role');
			const ariaLabel = svg?.getAttribute('aria-label');
			const ariaHidden = svg?.getAttribute('aria-hidden');

			expect(svg).toBeTruthy();
			expect([id, role, ariaLabel, ariaHidden].filter(attr => attr)).toEqual(['accessibility', 'true']);
		});
	});

	describe('Renders semantic icon', () => {
		let container: HTMLDivElement;
		let element: ObIcon | null;

		beforeEach(async () => {
			iconsRegistry.registerIcon(accessibilityIcon);

			container = document.createElement('div');
			document.body.appendChild(container);

			render(html`<ob-icon key="unregistered"></ob-icon>`, container);

			element = container.querySelector<ObIcon>('ob-icon');
			await element?.updateComplete;
		});

		test('renders with the correct attributes', () => {
			const svg = element?.shadowRoot?.querySelector('svg');

			expect(svg).toBeFalsy();
		});
	});
});
