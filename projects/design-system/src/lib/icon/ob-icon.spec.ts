import {beforeEach, describe, expect, test} from 'vitest';
import {html, render} from 'lit';
import {ObIcon} from './ob-icon';
import {iconsRegistry} from './ob-icons-registry';

describe(ObIcon.name, () => {
	const mockIcon = {
		key: 'mockIcon',
		svg: '<svg></svg>',
	};

	describe('Renders semantic icon', () => {
		let container: HTMLDivElement;
		let element: ObIcon | null;

		beforeEach(async () => {
			iconsRegistry.registerIcon(mockIcon);

			container = document.createElement('div');
			document.body.appendChild(container);

			render(html`<ob-icon key="mockIcon" label="Mock icon"></ob-icon>`, container);

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
			expect([id, role, ariaLabel, ariaHidden].filter(attr => attr)).toEqual(['mockIcon', 'img', 'Mock icon']);
		});
	});

	describe('Renders non semantic icon', () => {
		let container: HTMLDivElement;
		let element: ObIcon | null;

		beforeEach(async () => {
			iconsRegistry.registerIcon(mockIcon);

			container = document.createElement('div');
			document.body.appendChild(container);

			render(html`<ob-icon key="mockIcon"></ob-icon>`, container);

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
			expect([id, role, ariaLabel, ariaHidden].filter(attr => attr)).toEqual(['mockIcon', 'true']);
		});
	});

	describe('Renders semantic icon', () => {
		let container: HTMLDivElement;
		let element: ObIcon | null;

		beforeEach(async () => {
			iconsRegistry.registerIcon(mockIcon);

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
