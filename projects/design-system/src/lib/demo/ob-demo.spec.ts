import type {Locator} from '@vitest/browser/context';
import {beforeEach, describe, expect, test} from 'vitest';
import {render} from 'vitest-browser-lit';
import {html} from 'lit';
import type {RenderResult} from 'vitest-browser-lit/pure';
import {ObDemo} from './ob-demo';

describe(ObDemo.name, () => {
	let screen: RenderResult;
	let heading: Locator;

	beforeEach(() => {
		screen = render(html`<ob-demo title="Hello Vitest!"><span>bingo</span></ob-demo>`);
		heading = screen.getByRole('heading', {name: 'Hello Vitest!'});
	});

	test('renders heading', async () => {
		await expect.element(heading).toBeInTheDocument();
		await expect.element(screen.getByText('bingo')).not.toBeVisible();
	});

	test('renders content projection', async () => {
		await heading.click();
		await expect.element(screen.getByText('bingo')).toBeVisible();
	});
});
