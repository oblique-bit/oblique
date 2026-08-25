/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 1 version-aware component resolution
 */

import {ObliqueComponentResolutionError, getObliqueComponent} from './get-oblique-component.js';
import type {DirectusClient} from '../sources/directus/directus.client.js';
import type {TabbedPage, TabbedPageSummary} from '../sources/directus/directus.models.js';

function createPage({
	id,
	name = 'Button',
	slug,
	minVersion,
	maxVersion,
}: {
	id: number;
	name?: string;
	slug: string;
	minVersion: number | null;
	maxVersion: number | null;
}): TabbedPage {
	return {
		id,
		name,
		slug,
		api: '<ob-button>',
		accessibility: 'Use a descriptive label.',
		ui_ux_purpose: 'Trigger an action.',
		ui_ux_general_rules: [{id: 2, text: 'Use a clear label.'}],
		ui_ux_do: [{id: 3, text: 'Use an action verb.'}],
		ui_ux_do_not: [{id: 4, text: 'Use for navigation.'}],
		ui_ux_related_links: [{id: 5, text: 'https://example.test/button'}],
		ui_ux_additional_info: 'Available in several variants.',
		min_version: minVersion,
		max_version: maxVersion,
		deprecation: null,
	};
}

const pages = [
	createPage({id: 1, slug: 'button', minVersion: 11, maxVersion: 13}),
	createPage({id: 2, slug: 'button-14', minVersion: 14, maxVersion: 14}),
	createPage({id: 3, slug: 'button-15', minVersion: 15, maxVersion: null}),
];

function createClient(tabbedPages = pages): jest.Mocked<DirectusClient> {
	const pageById = new Map(tabbedPages.map(page => [page.id, page]));
	const summaries: TabbedPageSummary[] = tabbedPages.map(({id, name, slug, min_version, max_version}) => ({
		id,
		name,
		slug,
		min_version,
		max_version,
	}));
	return {
		getVersions: jest.fn(),
		getTabbedPages: jest.fn().mockResolvedValue(summaries),
		getTextPages: jest.fn(),
		getTabbedPage: jest.fn().mockImplementation(async (id: number) => {
			const page = pageById.get(id);
			if (page === undefined) {
				throw new Error(`Missing mocked page ${id}.`);
			}
			return page;
		}),
	};
}

describe('getObliqueComponent', () => {
	it('selects the current compatible version instead of a legacy base slug', async () => {
		const client = createClient();

		await expect(getObliqueComponent(client, 'button', 15)).resolves.toMatchObject({slug: 'button-15'});
		expect(client.getTabbedPage).toHaveBeenCalledWith(3);
	});

	it('resolves a version-suffixed slug against the requested version', async () => {
		const client = createClient();

		await expect(getObliqueComponent(client, 'BUTTON-15', 15)).resolves.toMatchObject({slug: 'button-15'});
	});

	it('resolves a legacy component version', async () => {
		const client = createClient();

		await expect(getObliqueComponent(client, 'button', 13)).resolves.toMatchObject({slug: 'button'});
	});

	it('treats a null minimum version as negative infinity', async () => {
		const client = createClient([createPage({id: 4, slug: 'dialog', minVersion: null, maxVersion: 12})]);

		await expect(getObliqueComponent(client, 'dialog', 1)).resolves.toMatchObject({slug: 'dialog'});
	});

	it('treats a null maximum version as positive infinity', async () => {
		const client = createClient([createPage({id: 5, slug: 'dialog-14', minVersion: 14, maxVersion: null})]);

		await expect(getObliqueComponent(client, 'dialog', 99)).resolves.toMatchObject({slug: 'dialog-14'});
	});

	it('keeps display-name lookups case-insensitive', async () => {
		const client = createClient();

		await expect(getObliqueComponent(client, '  BUTTON  ', 15)).resolves.toMatchObject({slug: 'button-15'});
	});

	it('returns undefined when no component is compatible with the requested version', async () => {
		const client = createClient();

		await expect(getObliqueComponent(client, 'button', 10)).resolves.toBeUndefined();
		expect(client.getTabbedPage).not.toHaveBeenCalled();
	});

	it('returns undefined when the component does not exist', async () => {
		const client = createClient();

		await expect(getObliqueComponent(client, 'unknown', 15)).resolves.toBeUndefined();
	});

	it('reports multiple compatible CMS entries deterministically', async () => {
		const client = createClient([
			createPage({id: 7, slug: 'button', minVersion: 15, maxVersion: null}),
			createPage({id: 6, slug: 'button-15', minVersion: 15, maxVersion: null}),
		]);

		await expect(getObliqueComponent(client, 'button', 15)).rejects.toEqual(
			new ObliqueComponentResolutionError(
				'Multiple Oblique components match "button" for version 15: button, button-15.'
			)
		);
	});

	it('maps UI/UX and version fields', async () => {
		const client = createClient([createPage({id: 8, slug: 'button', minVersion: 15, maxVersion: 16})]);
		client.getTabbedPage.mockResolvedValue({
			...pages[0],
			id: 8,
			min_version: 15,
			max_version: 16,
			ui_ux_general_rules: null,
			ui_ux_do: null,
			ui_ux_do_not: null,
			ui_ux_related_links: null,
		});

		await expect(getObliqueComponent(client, 'button', 15)).resolves.toMatchObject({
			uiUx: {generalRules: [], do: [], doNot: [], relatedLinks: []},
			version: {min: 15, max: 16},
		});
	});
});
