import {type Locator, type Page, expect, test} from '@playwright/test';

const columnLayoutRoute = '/en/samples/column-layout';

/** Maximum vertical drift, in px, that still counts as "did not move" (`toBeCloseTo` with 0 digits). */
const handleDriftDigits = 0;

/** The handle transition lasts 0.3s, so the position must stay unchanged for longer than that to be settled. */
const settledReadCount = 6;
const settledReadIntervalMs = 100;

/** Vertical position of every column toggle handle, keyed by its accessible name and DOM order. */
type HandleTops = Record<string, number>;

/** This package has no DOM typings, so this describes the members of a handle that the browser callback uses. */
interface HandleElement {
	readonly textContent: string;
	readonly ownerDocument: {readonly defaultView: {getComputedStyle: (element: HandleElement) => {top: string}}};
}

interface LayoutControl {
	readonly description: string;
	readonly change: (page: Page) => Promise<void>;
	readonly revert: (page: Page) => Promise<void>;
}

interface ScreenConfig {
	readonly name: string;
	readonly width: number;
	readonly height: number;
	readonly deviceScaleFactor: number;
	readonly controls: readonly LayoutControl[];
}

/**
 * Returns the sample's own control group ("Left" or "Right"), which holds the radios and the "Toggle" button.
 * @param page The page instance of the test
 * @param side The column the group controls
 */
function getControlGroup(page: Page, side: 'Left' | 'Right'): Locator {
	return page.getByRole('group', {name: side, exact: true});
}

/**
 * Returns the handles on the column edges. `includeHidden` keeps the handle of a collapsed column,
 * because Oblique hides collapsed columns from the accessibility tree while the handle stays clickable.
 * @param page The page instance of the test
 * @param side The column edge the handle sits on
 */
function getHandles(page: Page, side: 'left' | 'right'): Locator {
	return page.getByRole('button', {name: `Toggle ${side} column`, includeHidden: true});
}

const overflow: LayoutControl = {
	description: 'the overflow content is added and removed',
	change: async page => page.getByRole('checkbox', {name: 'Overflow'}).check(),
	revert: async page => page.getByRole('checkbox', {name: 'Overflow'}).uncheck(),
};

const removeLayout: LayoutControl = {
	description: 'the layout is removed and restored',
	change: async page => page.getByRole('switch', {name: 'Remove layout'}).click(),
	revert: async page => page.getByRole('switch', {name: 'Remove layout'}).click(),
};

const widerColumns: LayoutControl = {
	description: 'the columns are widened and narrowed',
	change: async page => page.getByRole('switch', {name: 'Wider columns'}).click(),
	revert: async page => page.getByRole('switch', {name: 'Wider columns'}).click(),
};

const leftToggleButton: LayoutControl = {
	description: 'the left column is collapsed and expanded with the sample button',
	change: async page => getControlGroup(page, 'Left').getByRole('button', {name: 'Toggle', exact: true}).click(),
	revert: async page => getControlGroup(page, 'Left').getByRole('button', {name: 'Toggle', exact: true}).click(),
};

const rightToggleButton: LayoutControl = {
	description: 'the right column is collapsed and expanded with the sample button',
	change: async page => getControlGroup(page, 'Right').getByRole('button', {name: 'Toggle', exact: true}).click(),
	revert: async page => getControlGroup(page, 'Right').getByRole('button', {name: 'Toggle', exact: true}).click(),
};

const leftColumnClosed: LayoutControl = {
	description: 'the left column is set to CLOSED and back to OPENED',
	change: async page => getControlGroup(page, 'Left').getByRole('radio', {name: 'CLOSED'}).check(),
	revert: async page => getControlGroup(page, 'Left').getByRole('radio', {name: 'OPENED'}).check(),
};

const rightColumnClosed: LayoutControl = {
	description: 'the right column is set to CLOSED and back to OPENED',
	change: async page => getControlGroup(page, 'Right').getByRole('radio', {name: 'CLOSED'}).check(),
	revert: async page => getControlGroup(page, 'Right').getByRole('radio', {name: 'OPENED'}).check(),
};

const leftColumnNone: LayoutControl = {
	description: 'the left column is set to NONE and back to OPENED',
	change: async page => getControlGroup(page, 'Left').getByRole('radio', {name: 'NONE'}).check(),
	revert: async page => getControlGroup(page, 'Left').getByRole('radio', {name: 'OPENED'}).check(),
};

const rightColumnNone: LayoutControl = {
	description: 'the right column is set to NONE and back to OPENED',
	change: async page => getControlGroup(page, 'Right').getByRole('radio', {name: 'NONE'}).check(),
	revert: async page => getControlGroup(page, 'Right').getByRole('radio', {name: 'OPENED'}).check(),
};

const leftHandle: LayoutControl = {
	description: 'the left handle collapses and expands its column',
	change: async page => getHandles(page, 'left').first().click(),
	revert: async page => getHandles(page, 'left').first().click(),
};

const rightHandle: LayoutControl = {
	description: 'the right handle collapses and expands its column',
	change: async page => getHandles(page, 'right').first().click(),
	revert: async page => getHandles(page, 'right').first().click(),
};

const allControls = [
	overflow,
	removeLayout,
	widerColumns,
	leftToggleButton,
	rightToggleButton,
	leftColumnClosed,
	rightColumnClosed,
	leftColumnNone,
	rightColumnNone,
	leftHandle,
	rightHandle,
];

const representativeControls = [overflow, rightToggleButton, leftColumnNone];

/**
 * The handle only recalculates wrongly when the layout is shorter than the space below its top edge,
 * which happens from roughly 900px of viewport height. Smaller viewports scroll while the test interacts.
 * The device scale factor is varied to guard against display scaling, it does not influence the CSS layout.
 */
const screens: readonly ScreenConfig[] = [
	{name: '1920x1080', width: 1920, height: 1080, deviceScaleFactor: 1, controls: allControls},
	{name: '1920x1080 at 2x scaling', width: 1920, height: 1080, deviceScaleFactor: 2, controls: representativeControls},
	{name: '1280x1100', width: 1280, height: 1100, deviceScaleFactor: 1, controls: representativeControls},
	{
		name: '2560x1440 at 1.25x scaling',
		width: 2560,
		height: 1440,
		deviceScaleFactor: 1.25,
		controls: representativeControls,
	},
];

/**
 * Returns every handle on the page: the inner left, the inner right and the outer right one in DOM order.
 * @param page The page instance of the test
 */
function getAllHandles(page: Page): Locator {
	return page.getByRole('button', {name: /^Toggle (?:left|right) column$/u, includeHidden: true});
}

/**
 * Reads the computed `top` of every handle in DOM order. The computed value ignores the hover and focus
 * scaling that moves the bounding box without moving the handle.
 * @param page The page instance of the test
 */
async function readHandleTops(page: Page): Promise<HandleTops> {
	const handles = await getAllHandles(page).evaluateAll((elements: HandleElement[]) =>
		elements.map(element => ({
			name: element.textContent.trim(),
			top: parseFloat(element.ownerDocument.defaultView.getComputedStyle(element).top),
		}))
	);
	const tops: HandleTops = {};
	handles.forEach(({name, top}, index) => (tops[`${name} #${index}`] = top));

	return tops;
}

/**
 * Waits until the handles stop moving, then returns their final positions.
 * @param page The page instance of the test
 */
async function readSettledHandleTops(page: Page): Promise<HandleTops> {
	let previous = await readHandleTops(page);
	let unchangedReads = 0;
	await expect
		.poll(
			async () => {
				const current = await readHandleTops(page);
				unchangedReads = JSON.stringify(current) === JSON.stringify(previous) ? unchangedReads + 1 : 0;
				previous = current;

				return unchangedReads;
			},
			{timeout: 5000, intervals: [settledReadIntervalMs]}
		)
		.toBeGreaterThanOrEqual(settledReadCount);

	return previous;
}

/**
 * Asserts that an unrelated click leaves every handle where it was.
 * @param page The page instance of the test
 * @param click The unrelated click that triggers a change detection
 */
async function expectUnrelatedClickKeepsHandles(page: Page, click: () => Promise<void>): Promise<void> {
	const before = await readSettledHandleTops(page);
	await click();
	const after = await readSettledHandleTops(page);

	expect(Object.keys(after)).toEqual(Object.keys(before));
	Object.keys(before).forEach(name =>
		expect(after[name], `${name} moved from ${before[name]}px to ${after[name]}px`).toBeCloseTo(
			before[name],
			handleDriftDigits
		)
	);
}

for (const screen of screens) {
	test.describe(`column layout handles on ${screen.name}`, () => {
		test.use({
			viewport: {width: screen.width, height: screen.height},
			deviceScaleFactor: screen.deviceScaleFactor,
		});

		test.beforeEach(async ({page}) => {
			await page.goto(columnLayoutRoute);
			await expect(page.getByRole('heading', {name: 'Controls'})).toBeVisible();
			await expect(getAllHandles(page)).toHaveCount(3);
			await readSettledHandleTops(page);
		});

		for (const control of screen.controls) {
			test(`keep their position on an unrelated click after ${control.description}`, async ({page}) => {
				await control.change(page);
				await expectUnrelatedClickKeepsHandles(page, async () => page.getByRole('heading', {name: 'Controls'}).click());

				await control.revert(page);
				await expectUnrelatedClickKeepsHandles(page, async () => page.getByRole('paragraph').first().click());
			});
		}
	});
}
