/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 2 search and examples
 */

import type {DirectusClient} from '../sources/directus/directus.client.js';

export interface ObliqueSearchResult {
	type: 'tabbed' | 'text';
	name: string;
	slug: string;
	version: {min: number | null; max: number | null};
}

interface SearchablePage {
	id: number;
	name: string;
	slug: string;
	min_version: number | null;
	max_version: number | null;
}

interface RankedSearchResult extends ObliqueSearchResult {
	rank: number;
	id: number;
}

export async function searchOblique(
	client: DirectusClient,
	query: string,
	version: number,
	limit: number
): Promise<ObliqueSearchResult[]> {
	const normalizedQuery = query.trim().toLocaleLowerCase();
	const [tabbedPages, textPages] = await Promise.all([client.getTabbedPages(), client.getTextPages()]);
	return [
		...toResults('tabbed', tabbedPages, normalizedQuery, version),
		...toResults('text', textPages, normalizedQuery, version),
	]
		.sort(compareResults)
		.slice(0, limit)
		.map(result => ({type: result.type, name: result.name, slug: result.slug, version: result.version}));
}

function toResults(
	type: ObliqueSearchResult['type'],
	pages: SearchablePage[],
	query: string,
	version: number
): RankedSearchResult[] {
	return pages
		.filter(page => isCompatibleVersion(page, version))
		.map(page => ({page, rank: getMatchRank(page, query)}))
		.filter((entry): entry is {page: SearchablePage; rank: number} => entry.rank !== undefined)
		.map(({page, rank}) => ({
			type,
			name: page.name,
			slug: page.slug,
			version: {min: page.min_version, max: page.max_version},
			rank,
			id: page.id,
		}));
}

function getMatchRank(page: SearchablePage, query: string): number | undefined {
	const slug = page.slug.toLocaleLowerCase();
	const name = page.name.toLocaleLowerCase();
	if (slug === query) {
		return 0;
	}
	if (name === query) {
		return 1;
	}
	if (slug.includes(query)) {
		return 2;
	}
	if (name.includes(query)) {
		return 3;
	}
	return undefined;
}

function isCompatibleVersion(page: SearchablePage, version: number): boolean {
	return (page.min_version ?? -Infinity) <= version && version <= (page.max_version ?? Infinity);
}

function compareResults(first: RankedSearchResult, second: RankedSearchResult): number {
	return (
		first.rank - second.rank ||
		first.type.localeCompare(second.type) ||
		first.name.localeCompare(second.name) ||
		first.slug.localeCompare(second.slug) ||
		first.id - second.id
	);
}
