import {beforeEach, describe, expect, test} from 'vitest';
import {html, render} from 'lit';
import {ObDemo} from './ob-demo';

describe(ObDemo.name, () => {
	let container: HTMLDivElement;
	let element: ObDemo;

	beforeEach(async () => {
		container = document.createElement('div');
		document.body.appendChild(container);

		render(
			html`
				<ob-demo title="Hello Vitest!">
					<span>bingo</span>
				</ob-demo>
			`,
			container
		);

		element = container.querySelector('ob-demo');

		await element.updateComplete;
	});

	test('renders heading and hides slot initially', () => {
		expect(element.shadowRoot?.textContent).toContain('Hello Vitest!');
		expect(element.shadowRoot?.querySelector('slot')).toBeNull();
	});

	test('toggles and renders slot content', async () => {
		const heading = element.shadowRoot?.querySelector('h1') as HTMLElement;
		expect(heading).toBeTruthy();
		heading.click();
		await element.updateComplete;
		const slotWrapper = element.shadowRoot?.querySelector('div');
		expect(slotWrapper).toBeTruthy();
		expect(container.querySelector('span')?.textContent).toBe('bingo');
	});
});
