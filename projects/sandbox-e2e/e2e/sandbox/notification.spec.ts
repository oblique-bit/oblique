import {type Locator, type Page, expect, test} from '@playwright/test';

const notificationRoute = '/en/samples/notification';

/**
 * Returns the notification alerts rendered by the notification component.
 *
 * Each notification is an `<ob-alert role="alert">` element. Scoping to the `ob-alert` element
 * avoids matching unrelated `role="alert"` elements on the page.
 */
function getAlerts(page: Page): Locator {
	return page.locator('ob-alert');
}

test.beforeEach(async ({page}) => {
	await page.goto(notificationRoute);
	await expect(page.getByRole('heading', {name: 'Notification'})).toBeVisible();
	await clearAllAlerts(page);
});

/**
 * Clears all notification alerts by clicking the "Clear all" button and verifying that no alerts remain.
 * @param page The Page instance of the test
 */
async function clearAllAlerts(page: Page): Promise<void> {
	await page.getByRole('button', {name: 'Clear all'}).click();
	await expect(getAlerts(page)).toHaveCount(0);
}

/**
 * Sends a notification with the specified message.
 * @param page The page instance of the test
 * @param message The message to display
 */
async function sendNotification(page: Page, message: string): Promise<void> {
	await page.getByLabel('Message').fill(message);
	await page.getByRole('button', {name: 'Send notification'}).click();
}

/** The notification variants offered by the sample's "Variant" select. */
type NotificationVariant = 'info' | 'success' | 'warning' | 'error';

/**
 * Selects the given notification variant in the "Variant" select.
 * @param page The page instance of the test
 * @param variant The variant to select
 */
async function selectVariant(page: Page, variant: NotificationVariant): Promise<void> {
	await page.getByLabel('Variant').click();
	await page.getByRole('option', {name: variant}).click();
}

/** The notification channels offered by the sample's "Channel" select. */
type NotificationChannel = 'demo' | 'oblique';

/**
 * Selects the given notification channel in the "Channel" select.
 * @param page The page instance of the test
 * @param channel The channel to select
 */
async function selectChannel(page: Page, channel: NotificationChannel): Promise<void> {
	await page.getByLabel('Channel', {exact: true}).click();
	await page.getByRole('option', {name: channel}).click();
}

test('sends and displays a notification with the entered message', async ({page}) => {
	const message = `Smoke message ${Date.now()}`;

	await sendNotification(page, message);

	await expect(getAlerts(page)).toHaveCount(1);
	await expect(getAlerts(page).first().locator('p')).toContainText(message);
});

test('sends and displays a notification with the entered title', async ({page}) => {
	const title = `Title message ${Date.now()}`;

	await page.getByLabel('Message').fill('Test message');
	// Exact matching avoids strict-mode violations while translations are still loading:
	// untranslated aria-labels (raw i18n keys) all contain the substring "title".
	await page.getByLabel('Title', {exact: true}).fill(title);
	await page.getByRole('button', {name: 'Send notification'}).click();

	await expect(getAlerts(page)).toHaveCount(1);
	await expect(getAlerts(page).first().locator('.ob-notification-title')).toContainText(title);
});

const variants: {name: NotificationVariant; className: string; title: string}[] = [
	{name: 'info', className: 'ob-alert-info', title: 'Info'},
	{name: 'success', className: 'ob-alert-success', title: 'Success'},
	{name: 'warning', className: 'ob-alert-warning', title: 'Warning'},
	{name: 'error', className: 'ob-alert-error', title: 'Error'},
];

variants.forEach(({name, className, title}) => {
	test.describe(`variant: ${name}`, () => {
		test('applies the variant CSS class', async ({page}) => {
			const message = `Variant ${name} ${Date.now()}`;

			await selectVariant(page, name);
			await sendNotification(page, message);

			await expect(getAlerts(page)).toHaveCount(1);
			await expect(getAlerts(page).first()).toHaveClass(new RegExp(className, 'u'));
		});

		test('uses the variant default title', async ({page}) => {
			const message = `Variant title ${name} ${Date.now()}`;

			// Clear the pre-filled title so the service falls back to the variant default title.
			await page.getByLabel('Title', {exact: true}).fill('');
			await selectVariant(page, name);
			await sendNotification(page, message);

			await expect(getAlerts(page)).toHaveCount(1);
			await expect(getAlerts(page).first().locator('.ob-notification-title')).toHaveText(title);
		});
	});
});

test.describe('error variant', () => {
	test('keeps an error notification visible past the timeout', async ({page}) => {
		const message = `Error sticky ${Date.now()}`;

		// Fill the timeout before selecting the error variant: the Timeout field is
		// hidden while the error variant is selected.
		await page.getByLabel('Timeout').fill('500');
		await selectVariant(page, 'error');
		await sendNotification(page, message);

		await expect(getAlerts(page)).toHaveCount(1);

		// Error notifications are sticky by default, so they must outlive the 500ms timeout.
		// expect.poll would resolve on the first match, so let the time pass first, then assert.
		await page.waitForTimeout(1_000);
		await expect(getAlerts(page)).toHaveCount(1);
	});

	test('hides the sticky checkbox for the error variant', async ({page}) => {
		await selectVariant(page, 'error');
		await expect(page.getByRole('checkbox', {name: 'Sticky?'})).toHaveCount(0);
	});
});

test.describe('sticky notifications', () => {
	// Runs before every test in this group
	test.beforeEach(async ({page}) => {
		await page.getByRole('checkbox', {name: 'Sticky?'}).check();
	});

	test('keeps a sticky notification visible past the default timeout', async ({page}) => {
		const message = `Sticky message ${Date.now()}`;

		await sendNotification(page, message);

		await expect(getAlerts(page)).toHaveCount(1);

		// The default timeout is 2500ms plus a 350ms remove delay; a sticky notification
		// must outlive both. expect.poll would resolve on the first match, so let the
		// time pass first, then assert.
		await page.waitForTimeout(3_000);
		await expect(getAlerts(page)).toHaveCount(1);
	});

	test('groups similar notifications when group mode is active', async ({page}) => {
		const message = `Grouped message ${Date.now()}`;

		await page.getByRole('switch', {name: 'Group similar'}).click();

		const sendButton = page.getByRole('button', {name: 'Send notification'});
		await page.getByLabel('Message').fill(message);
		await sendButton.click();
		await sendButton.click();
		await sendButton.click();

		await expect(getAlerts(page)).toHaveCount(1);
	});

	test('clears all notifications with the clear button', async ({page}) => {
		const message = `Sticky clear ${Date.now()}`;

		await sendNotification(page, message);
		await sendNotification(page, message);
		await expect(getAlerts(page)).toHaveCount(2);

		const clearButton = page.getByRole('button', {name: 'Clear', exact: true});
		await clearButton.click();
		await expect(getAlerts(page)).toHaveCount(0);
	});

	test('clears all notifications with the clear all button', async ({page}) => {
		const message = `Sticky clear all ${Date.now()}`;

		await sendNotification(page, message);
		await sendNotification(page, message);
		await expect(getAlerts(page)).toHaveCount(2);

		await page.getByRole('button', {name: 'Clear all'}).click();
		await expect(getAlerts(page)).toHaveCount(0);
	});

	test('clears a single notification with its close button', async ({page}) => {
		const message = `Single clear ${Date.now()}`;

		await sendNotification(page, message);
		await sendNotification(page, message);
		await expect(getAlerts(page)).toHaveCount(2);

		const getCloseButton = (): Locator => getAlerts(page).first().getByRole('button', {name: 'Close'});
		await getCloseButton().click();
		await expect(getAlerts(page)).toHaveCount(1);
		await getCloseButton().click();
		await expect(getAlerts(page)).toHaveCount(0);
	});
});

test.describe('custom timeout', () => {
	test('dismisses a non-sticky notification after the custom timeout', async ({page}) => {
		const message = `Custom timeout ${Date.now()}`;

		await page.getByLabel('Timeout').fill('500');
		const sentAt = Date.now();
		await sendNotification(page, message);

		await expect(getAlerts(page)).toHaveCount(1);

		/*
		 * Two-sided timing check:
		 * - The poll timeout (2.2s) is deliberately shorter than the default dismissal time
		 *   (2500ms timeout + 350ms remove delay), so the test fails if the custom timeout
		 *   is ignored and the default is used instead.
		 * - The tight poll interval (100ms) keeps the measured elapsed time close to the true
		 *   removal moment, so the lower-bound assertion catches a premature dismissal
		 *   (e.g. timeout 0/undefined firing immediately).
		 * The poll can only resolve after the alert left the DOM, so the measured elapsed
		 * time can overshoot but never undershoot the true removal time.
		 */
		await expect
			.poll(async () => getAlerts(page).count(), {
				timeout: 2_200,
				intervals: [100],
				message: 'notification should auto-dismiss after the custom 500ms timeout (default is 2500ms)',
			})
			.toBe(0);
		expect(Date.now() - sentAt).toBeGreaterThanOrEqual(500);
	});
});

test('clears notifications from the selected channel', async ({page}) => {
	const message = `Channel clear ${Date.now()}`;

	await selectChannel(page, 'oblique');
	await sendNotification(page, message);
	await expect(getAlerts(page)).toHaveCount(1);

	await page.getByRole('button', {name: 'Clear', exact: true}).click();
	await expect(getAlerts(page)).toHaveCount(0);
});

test.describe('placement', () => {
	// The placement class is bound on the `ob-notification` host element. The
	// master-layout container (first on the page) is `position: fixed` and anchored
	// to the viewport side matching its class.
	const placements = [
		{name: 'TOP_LEFT', className: 'ob-top-left', isTop: true, isLeft: true},
		{name: 'TOP_RIGHT', className: 'ob-top-right', isTop: true, isLeft: false},
		{name: 'BOTTOM_LEFT', className: 'ob-bottom-left', isTop: false, isLeft: true},
		{name: 'BOTTOM_RIGHT', className: 'ob-bottom-right', isTop: false, isLeft: false},
	];

	placements.forEach(({name, className, isTop, isLeft}) => {
		test(`positions the notification container in the ${name.toLowerCase().replace('_', ' ')} corner`, async ({
			page,
		}) => {
			await page.getByLabel('Placement').click();
			// The sample renders the enum keys as option labels (e.g. `TOP_LEFT`).
			await page.getByRole('option', {name}).click();

			const container = page.locator('ob-notification').first();
			await expect(container).toHaveClass(new RegExp(className, 'u'));

			// Anchored to the viewport quadrant matching the placement class.
			const box = await container.boundingBox();
			const {width = 0, height = 0} = page.viewportSize() ?? {};
			if (isLeft) {
				expect(box?.x).toBeLessThan(width / 2);
			} else {
				expect(box?.x).toBeGreaterThan(width / 2);
			}
			if (isTop) {
				expect(box?.y).toBeLessThan(height / 2);
			} else {
				expect(box?.y).toBeGreaterThan(height / 2);
			}
		});
	});
});

test.describe('translation key with parameters', () => {
	// Both the message and the title fieldsets contain a toggle with the same
	// accessible name, so the toggles are addressed by their position in the DOM.
	const getMessageParamsToggle = (page: Page): Locator =>
		page.getByRole('switch', {name: 'Translation key with parameters'}).first();
	const getTitleParamsToggle = (page: Page): Locator =>
		page.getByRole('switch', {name: 'Translation key with parameters'}).nth(1);

	test('interpolates the message translation key with its parameters', async ({page}) => {
		await getMessageParamsToggle(page).click();
		await page.getByLabel('"message" parameter').fill('custom message');
		await page.getByLabel('"parameters" parameter').fill('custom parameters');
		await page.getByRole('button', {name: 'Send notification'}).click();

		await expect(getAlerts(page)).toHaveCount(1);
		await expect(getAlerts(page).first().locator('p')).toContainText('This is a custom message with custom parameters');
	});

	test('interpolates the title translation key with its parameters', async ({page}) => {
		await getTitleParamsToggle(page).click();
		await page.getByLabel('"title" parameter').fill('custom title');
		await page.getByLabel('"parameters" parameter').fill('custom parameters');
		await page.getByRole('button', {name: 'Send notification'}).click();

		await expect(getAlerts(page)).toHaveCount(1);
		await expect(getAlerts(page).first().locator('.ob-notification-title')).toContainText(
			'This is a custom title with custom parameters'
		);
	});
});

test.describe('clear all on navigate', () => {
	// The `oblique` channel notifications render in the master-layout notification
	// container, which persists across in-app navigation, unlike the sample's own
	// `demo` channel container that is destroyed with the sample component.
	const getMasterLayoutAlerts = (page: Page): Locator => page.locator('main ob-alert');

	async function navigateToAnotherSample(page: Page): Promise<void> {
		await page.getByRole('button', {name: 'Samples', exact: true}).click();
		await page.locator('.ob-sub-menu:visible').getByRole('link', {name: 'Buttons', exact: true}).click();
		// The button sample has no heading; its table caption is the stable landmark.
		await expect(page.getByText('Primary, secondary, and tertiary buttons')).toBeVisible();
	}

	test('keeps notifications when clearAllOnNavigate is disabled', async ({page}) => {
		const message = `Navigate keep ${Date.now()}`;

		await selectChannel(page, 'oblique');
		await sendNotification(page, message);
		await expect(getMasterLayoutAlerts(page)).toHaveCount(1);

		await navigateToAnotherSample(page);

		await expect(getMasterLayoutAlerts(page)).toHaveCount(1);
		await expect(getMasterLayoutAlerts(page).first().locator('p')).toContainText(message);
	});

	test('clears notifications when clearAllOnNavigate is enabled', async ({page}) => {
		const message = `Navigate clear ${Date.now()}`;

		await page.getByRole('switch', {name: 'ClearAll on navigate'}).click();
		await selectChannel(page, 'oblique');
		await sendNotification(page, message);
		await expect(getMasterLayoutAlerts(page)).toHaveCount(1);

		await navigateToAnotherSample(page);

		await expect(getMasterLayoutAlerts(page)).toHaveCount(0);
	});
});
