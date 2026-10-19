import {type Locator, type Page, expect, test} from '@playwright/test';

/**
 * Pins the browser timezone to the one the date formatters normalize to, so the typed date and the
 * time merged by the timepicker are deterministic regardless of the machine running the tests.
 */
test.use({timezoneId: 'Europe/Zurich'});

/** The sandbox languages, each served under its own URL segment. */
const languages = ['en', 'fr', 'de', 'it'] as const;
type Language = (typeof languages)[number];

/** The fixed date typed into the datepicker before asserting on formatted output. */
const fixedDate = '31.12.2025';
/** The fixed time typed into the timepicker after the fixed date. */
const fixedTime = '08:30';
/** The ISO datetime the ObDateComponent renders for the fixed date and time. */
const fixedDatetime = '2025-12-31T08:30';
/** Matches the Swiss short date the formatters normalize every locale to, e.g. 31.12.2025. */
const shortDatePattern = /\d{2}\.\d{2}\.\d{4}/u;

/** The expected formatted date and time (shortDate + shortTime) per language. */
const expectedFormats: Record<Language, string> = {
	en: '31.12.2025, 08:30',
	fr: '31.12.2025 08:30', // for some reason only French is different
	de: '31.12.2025, 08:30',
	it: '31.12.2025, 08:30',
};

/** The URL inputs the sample renders in the ObLocalizePipe table, in row order. */
const localizeInputs = [
	'/samples/alert',
	'/en/samples/alert',
	'/fr/samples/alert',
	'',
	'/',
	'../',
	'../alert',
	'../../',
	'../../alert',
	'../../../',
	'../../../alert',
	'alert',
] as const;

/**
 * Returns the expected localized URL for each ObLocalizePipe input, in row order.
 * @param lang The current sandbox language
 */
function getExpectedLocalizedUrls(lang: Language): string[] {
	return [
		`/${lang}/samples/alert`,
		`/${lang}/samples/alert`,
		`/${lang}/samples/alert`,
		`/${lang}/samples/language`,
		`/${lang}`,
		`/${lang}/samples`,
		`/${lang}/samples/alert`,
		`/${lang}`,
		`/${lang}/alert`,
		`/${lang}`,
		`/${lang}/alert`,
		`/${lang}/samples/language/alert`,
	];
}

/** Returns the datepicker input of the language sample. */
function getDatepicker(page: Page): Locator {
	return page.getByRole('textbox', {name: 'Datepicker'});
}

/** Returns the timepicker input of the language sample. */
function getTimepicker(page: Page): Locator {
	return page.getByRole('combobox', {name: 'Choose a time'});
}

/** Returns the formatted date rendered by the ObDatePipe. */
function getPipeOutput(page: Page): Locator {
	return page.locator("dt:text-is('ObDatePipe') + dd");
}

/** Returns the `<time>` element rendered by the ObDateComponent. */
function getComponentOutput(page: Page): Locator {
	return page.locator('ob-date time');
}

/** Returns the ObLocalizePipe table of the language sample. */
function getLocalizeTable(page: Page): Locator {
	return page.getByRole('table', {name: /ObLocalizePipe handles localization/u});
}

/**
 * Asserts that the ObDatePipe and the ObDateComponent render the same formatted output.
 * @param pipe The ObDatePipe output locator
 * @param component The ObDateComponent output locator
 */
async function expectSameFormattedOutput(pipe: Locator, component: Locator): Promise<void> {
	await expect(component).toHaveText(await pipe.textContent());
}

/** Switches the sample's date format select to fullDate. */
async function selectDateFormat(page: Page): Promise<void> {
	await page.getByRole('combobox', {name: 'Date format'}).click();
	await page.getByRole('option', {name: 'fullDate', exact: true}).click();
}

/** Switches the sample's time format select to longTime. */
async function selectTimeFormat(page: Page): Promise<void> {
	await page.getByRole('combobox', {name: 'Time format'}).click();
	await page.getByRole('option', {name: 'longTime', exact: true}).click();
}

languages.forEach(lang => {
	test.describe(`language: ${lang}`, () => {
		test.beforeEach(async ({page}) => {
			await page.goto(`/${lang}/samples/language`);
			await expect(page.getByRole('heading', {name: 'Language', exact: true})).toBeVisible();
		});

		test('displays the same formatted date and time in the pipe and the component across interactions', async ({
			page,
		}) => {
			const pipe = getPipeOutput(page);
			const component = getComponentOutput(page);

			// Initial render: today's date with the default short formats.
			await expect(pipe).toHaveText(shortDatePattern);
			await expectSameFormattedOutput(pipe, component);

			// Typing a fixed date makes the formatted output deterministic.
			await getDatepicker(page).fill(fixedDate);
			await expect(getDatepicker(page)).toHaveValue(fixedDate);
			await expect(pipe).toContainText(fixedDate);
			await expectSameFormattedOutput(pipe, component);

			// Changing the date format must update both outputs.
			const beforeDateFormatChange = await pipe.textContent();
			await selectDateFormat(page);
			await expect(pipe).not.toHaveText(beforeDateFormatChange);
			await expectSameFormattedOutput(pipe, component);

			// Changing the time format must update both outputs.
			const beforeTimeFormatChange = await pipe.textContent();
			await selectTimeFormat(page);
			await expect(pipe).not.toHaveText(beforeTimeFormatChange);
			await expectSameFormattedOutput(pipe, component);

			// Changing the time must update both outputs.
			const beforeTimeChange = await pipe.textContent();
			await getTimepicker(page).fill(fixedTime);
			await expect(getTimepicker(page)).toHaveValue(fixedTime);
			await expect(pipe).not.toHaveText(beforeTimeChange);
			await expectSameFormattedOutput(pipe, component);
		});

		test('formats the typed date and time with the Swiss conventions of the current language', async ({page}) => {
			await getDatepicker(page).fill(fixedDate);
			await getTimepicker(page).fill(fixedTime);

			await expect(getPipeOutput(page)).toHaveText(expectedFormats[lang]);
			await expect(getComponentOutput(page)).toHaveText(expectedFormats[lang]);
			await expect(getComponentOutput(page)).toHaveAttribute('datetime', fixedDatetime);
		});

		test('localizes all input URLs to the current language', async ({page}) => {
			const table = getLocalizeTable(page);

			await expect(table.locator('tbody tr')).toHaveCount(localizeInputs.length);
			await expect(table.locator('tbody tr td:first-child')).toHaveText([...localizeInputs]);
			await expect(table.locator('tbody tr td:last-child')).toHaveText(getExpectedLocalizedUrls(lang));
		});
	});
});
