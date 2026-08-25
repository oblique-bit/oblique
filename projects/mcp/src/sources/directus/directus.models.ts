/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 1 initial server
 */

export interface DirectusResponse<T> {
	data: T;
}

export interface TabbedPageSummary {
	id: number;
	name: string;
	slug: string;
	min_version: number | null;
	max_version: number | null;
}

export interface TextPageSummary {
	id: number;
	name: string;
	slug: string;
	category: number;
	min_version: number | null;
	max_version: number | null;
}

export interface UiUxEntry {
	id: number;
	text: string;
}

export interface TabbedPage {
	id: number;
	name: string;
	slug: string;
	api: string | null;
	accessibility: string | null;
	ui_ux_purpose: string | null;
	ui_ux_general_rules: UiUxEntry[] | null;
	ui_ux_do: UiUxEntry[] | null;
	ui_ux_do_not: UiUxEntry[] | null;
	ui_ux_related_links: UiUxEntry[] | null;
	ui_ux_additional_info: string | null;
	min_version: number | null;
	max_version: number | null;
	deprecation: string | null;
}

export interface Version {
	id: number;
	version_number: number;
	base_url: string;
}
