/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 2 search and examples
 */

import {searchOblique} from './search-oblique.js';
import type {DirectusClient} from '../sources/directus/directus.client.js';

function createClient(): jest.Mocked<DirectusClient> {
	return {
		getVersions: jest.fn(),
		getTabbedPages: jest.fn().mockResolvedValue([
			{id: 1, name: 'Button', slug: 'button', min_version: 11, max_version: 13},
			{id: 2, name: 'Button', slug: 'button-14', min_version: 14, max_version: null},
			{id: 3, name: 'Notification', slug: 'notification', min_version: null, max_version: 15},
			{id: 4, name: 'Form controls', slug: 'form-controls', min_version: null, max_version: null},
		]),
		getTextPages: jest.fn().mockResolvedValue([
			{id: 5, name: 'Button guidance', slug: 'button-guidance', category: 1, min_version: 14, max_version: null},
			{id: 6, name: 'Form overview', slug: 'form', category: 1, min_version: null, max_version: null},
			{id: 7, name: 'Accessibility guidance', slug: 'a11y', category: 1, min_version: null, max_version: null},
		]),
		getTabbedPage: jest.fn(),
	};
}

describe('searchOblique', () => {
	it('finds an exact current-version slug without returning obsolete pages', async () => {
		await expect(searchOblique(createClient(), 'button', 15, 10)).resolves.toEqual([
			{type: 'tabbed', name: 'Button', slug: 'button-14', version: {min: 14, max: null}},
			{type: 'text', name: 'Button guidance', slug: 'button-guidance', version: {min: 14, max: null}},
		]);
	});

	it('supports exact names and case-insensitive partial queries', async () => {
		const client = createClient();

		await expect(searchOblique(client, '  FORM CONTROLS ', 15, 10)).resolves.toMatchObject([{slug: 'form-controls'}]);
		await expect(searchOblique(client, 'form', 15, 10)).resolves.toMatchObject([
			{type: 'text', slug: 'form'},
			{type: 'tabbed', slug: 'form-controls'},
		]);
	});

	it('includes legacy pages for an explicit compatible version', async () => {
		await expect(searchOblique(createClient(), 'button', 13, 10)).resolves.toEqual([
			{type: 'tabbed', name: 'Button', slug: 'button', version: {min: 11, max: 13}},
		]);
	});

	it('treats null version bounds as unbounded', async () => {
		await expect(searchOblique(createClient(), 'notification', 1, 10)).resolves.toHaveLength(1);
		await expect(searchOblique(createClient(), 'form', 99, 10)).resolves.toHaveLength(2);
	});

	it('limits deterministically ranked results', async () => {
		await expect(searchOblique(createClient(), 'button', 15, 1)).resolves.toEqual([
			{type: 'tabbed', name: 'Button', slug: 'button-14', version: {min: 14, max: null}},
		]);
	});

	it('finds partial documentation names when their slug does not match', async () => {
		await expect(searchOblique(createClient(), 'accessibility', 15, 10)).resolves.toEqual([
			{type: 'text', name: 'Accessibility guidance', slug: 'a11y', version: {min: null, max: null}},
		]);
	});

	it('uses every deterministic ordering tie-breaker', async () => {
		const client: jest.Mocked<DirectusClient> = {
			getVersions: jest.fn(),
			getTabbedPages: jest.fn().mockResolvedValue([
				{id: 9, name: 'Match', slug: 'match-a', min_version: null, max_version: null},
				{id: 8, name: 'Match', slug: 'match-b', min_version: null, max_version: null},
				{id: 7, name: 'Match', slug: 'match-b', min_version: null, max_version: null},
			]),
			getTextPages: jest.fn().mockResolvedValue([]),
			getTabbedPage: jest.fn(),
		};

		await expect(searchOblique(client, 'match', 15, 10)).resolves.toMatchObject([
			{slug: 'match-a'},
			{slug: 'match-b'},
			{slug: 'match-b'},
		]);
	});

	it('returns no results when no page matches', async () => {
		await expect(searchOblique(createClient(), 'unknown', 15, 10)).resolves.toEqual([]);
	});
});
