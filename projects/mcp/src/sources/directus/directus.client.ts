/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 1 initial server
 */

import type {DirectusResponse, TabbedPage, TabbedPageSummary, TextPageSummary, Version} from './directus.models.js';

const directusBaseUrl = 'https://oblique.directus.app/';
const defaultTimeoutMs = 10_000;

export class DirectusClientError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'DirectusClientError';
	}
}

export interface DirectusClient {
	getVersions: () => Promise<Version[]>;
	getTabbedPages: () => Promise<TabbedPageSummary[]>;
	getTextPages: () => Promise<TextPageSummary[]>;
	getTabbedPage: (id: number) => Promise<TabbedPage>;
}

export class ObliqueDirectusClient implements DirectusClient {
	private readonly fetchFn: typeof fetch;
	private readonly timeoutMs: number;

	constructor(fetchFn: typeof fetch = fetch, timeoutMs = defaultTimeoutMs) {
		this.fetchFn = fetchFn;
		this.timeoutMs = timeoutMs;
	}

	async getVersions(): Promise<Version[]> {
		return this.getCollection<Version>('items/Version');
	}

	async getTabbedPages(): Promise<TabbedPageSummary[]> {
		return this.getCollection<TabbedPageSummary>(
			'items/TabbedPage?fields=id,name,slug,min_version,max_version&sort=order,name'
		);
	}

	async getTextPages(): Promise<TextPageSummary[]> {
		return this.getCollection<TextPageSummary>(
			'items/TextPage?fields=id,name,slug,category,min_version,max_version&sort=order,name'
		);
	}

	async getTabbedPage(id: number): Promise<TabbedPage> {
		return this.getItem<TabbedPage>(`items/TabbedPage/${id}/?fields=*.*`);
	}

	private async getCollection<T>(path: string): Promise<T[]> {
		const response = await this.request(path);
		const body = await this.getBody(response);
		if (!isCollectionResponse<T>(body)) {
			throw new DirectusClientError('Directus returned an invalid collection response.');
		}
		return body.data;
	}

	private async getItem<T>(path: string): Promise<T> {
		const response = await this.request(path);
		const body = await this.getBody(response);
		if (!isItemResponse<T>(body)) {
			throw new DirectusClientError('Directus returned an invalid item response.');
		}
		return body.data;
	}

	private async request(path: string): Promise<Response> {
		const abortController = new AbortController();
		const timeout = setTimeout(() => abortController.abort(), this.timeoutMs);
		try {
			const response = await this.fetchFn(new URL(path, directusBaseUrl), {signal: abortController.signal});
			if (!response.ok) {
				throw new DirectusClientError(`Directus request failed with HTTP ${response.status}.`);
			}
			return response;
		} catch (error: unknown) {
			if (error instanceof DirectusClientError) {
				throw error;
			}
			throw new DirectusClientError('Unable to retrieve data from Directus.');
		} finally {
			clearTimeout(timeout);
		}
	}

	private async getBody(response: Response): Promise<unknown> {
		try {
			const body: unknown = await response.json();
			return body;
		} catch {
			throw new DirectusClientError('Directus returned an invalid JSON response.');
		}
	}
}

function isCollectionResponse<T>(value: unknown): value is DirectusResponse<T[]> {
	return isRecord(value) && Array.isArray(value['data']);
}

function isItemResponse<T>(value: unknown): value is DirectusResponse<T> {
	return isRecord(value) && value['data'] !== null && !Array.isArray(value['data']);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}
