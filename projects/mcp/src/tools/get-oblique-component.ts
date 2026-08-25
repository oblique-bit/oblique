/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 1 initial server
 */

import type {DirectusClient} from '../sources/directus/directus.client.js';
import type {TabbedPage, UiUxEntry} from '../sources/directus/directus.models.js';

export interface ObliqueComponent {
	name: string;
	slug: string;
	api: string | null;
	accessibility: string | null;
	uiUx: {
		purpose: string | null;
		generalRules: string[];
		do: string[];
		doNot: string[];
		additionalInfo: string | null;
		relatedLinks: string[];
	};
	version: {
		min: number | null;
		max: number | null;
	};
	deprecation: string | null;
}

export class ObliqueComponentResolutionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ObliqueComponentResolutionError';
	}
}

export async function getObliqueComponent(
	client: DirectusClient,
	name: string,
	version: number
): Promise<ObliqueComponent | undefined> {
	const normalizedName = name.trim().toLocaleLowerCase();
	const page = resolveComponent(await client.getTabbedPages(), normalizedName, version);
	if (page === undefined) {
		return undefined;
	}
	return mapTabbedPage(await client.getTabbedPage(page.id));
}

function resolveComponent(
	pages: Awaited<ReturnType<DirectusClient['getTabbedPages']>>,
	name: string,
	version: number
): Awaited<ReturnType<DirectusClient['getTabbedPages']>>[number] | undefined {
	const baseSlug = removeVersionFromSlug(name);
	const matchingPages = pages.filter(
		page =>
			(isCompatibleSlug(page.slug, baseSlug) || page.name.toLocaleLowerCase() === name) &&
			isCompatibleVersion(page, version)
	);
	if (matchingPages.length <= 1) {
		return matchingPages[0];
	}
	const slugs = matchingPages.map(page => page.slug).sort((first, second) => first.localeCompare(second));
	throw new ObliqueComponentResolutionError(
		`Multiple Oblique components match "${name}" for version ${version}: ${slugs.join(', ')}.`
	);
}

function removeVersionFromSlug(slug: string): string {
	return slug.replace(/-\d+$/u, '');
}

function isCompatibleSlug(slug: string, baseSlug: string): boolean {
	return new RegExp(`^${escapeRegExp(baseSlug)}(?:-\\d+)?$`, 'u').test(slug.toLocaleLowerCase());
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function isCompatibleVersion(
	page: Awaited<ReturnType<DirectusClient['getTabbedPages']>>[number],
	version: number
): boolean {
	return (page.min_version ?? -Infinity) <= version && version <= (page.max_version ?? Infinity);
}

function mapTabbedPage(page: TabbedPage): ObliqueComponent {
	return {
		name: page.name,
		slug: page.slug,
		api: page.api,
		accessibility: page.accessibility,
		uiUx: {
			purpose: page.ui_ux_purpose,
			generalRules: getEntryTexts(page.ui_ux_general_rules),
			do: getEntryTexts(page.ui_ux_do),
			doNot: getEntryTexts(page.ui_ux_do_not),
			additionalInfo: page.ui_ux_additional_info,
			relatedLinks: getEntryTexts(page.ui_ux_related_links),
		},
		version: {min: page.min_version, max: page.max_version},
		deprecation: page.deprecation,
	};
}

function getEntryTexts(entries: UiUxEntry[] | null): string[] {
	return entries?.map(entry => entry.text) ?? [];
}
