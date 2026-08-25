/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 1 initial server
 */

import {ObliqueDirectusClient} from './directus.client.js';

describe('ObliqueDirectusClient', () => {
	it('uses the native fetch implementation by default', () => {
		expect(new ObliqueDirectusClient()).toBeInstanceOf(ObliqueDirectusClient);
	});

	it('parses successful collection and item responses', async () => {
		const fetchFn = jest
			.fn<typeof fetch>()
			.mockResolvedValueOnce(new Response(JSON.stringify({data: [{id: 1, version_number: 15, base_url: '/15'}]})))
			.mockResolvedValueOnce(
				new Response(
					JSON.stringify({data: [{id: 2, name: 'Button', slug: 'button', min_version: null, max_version: null}]})
				)
			)
			.mockResolvedValueOnce(
				new Response(
					JSON.stringify({
						data: [
							{id: 3, name: 'Introduction', slug: 'introduction', category: 1, min_version: null, max_version: null},
						],
					})
				)
			)
			.mockResolvedValueOnce(new Response(JSON.stringify({data: {id: 2, name: 'Button', slug: 'button'}})));
		const client = new ObliqueDirectusClient(fetchFn);

		await expect(client.getVersions()).resolves.toEqual([{id: 1, version_number: 15, base_url: '/15'}]);
		await expect(client.getTabbedPages()).resolves.toEqual([
			{id: 2, name: 'Button', slug: 'button', min_version: null, max_version: null},
		]);
		await expect(client.getTextPages()).resolves.toEqual([
			{id: 3, name: 'Introduction', slug: 'introduction', category: 1, min_version: null, max_version: null},
		]);
		await expect(client.getTabbedPage(2)).resolves.toEqual({id: 2, name: 'Button', slug: 'button'});
		expect(fetchFn.mock.calls.map(([url]) => url.toString())).toEqual([
			'https://oblique.directus.app/items/Version',
			'https://oblique.directus.app/items/TabbedPage?fields=id,name,slug,min_version,max_version&sort=order,name',
			'https://oblique.directus.app/items/TextPage?fields=id,name,slug,category,min_version,max_version&sort=order,name',
			'https://oblique.directus.app/items/TabbedPage/2/?fields=*.*',
		]);
	});

	it('throws a descriptive error for HTTP failures', async () => {
		const client = new ObliqueDirectusClient(
			jest.fn<typeof fetch>().mockResolvedValue(new Response(null, {status: 503}))
		);

		await expect(client.getVersions()).rejects.toThrow('Directus request failed with HTTP 503.');
	});

	it('throws a descriptive error for network failures', async () => {
		const client = new ObliqueDirectusClient(jest.fn<typeof fetch>().mockRejectedValue(new Error('network')));

		await expect(client.getVersions()).rejects.toThrow('Unable to retrieve data from Directus.');
	});

	it('throws a descriptive error for invalid JSON and malformed response bodies', async () => {
		const invalidJsonClient = new ObliqueDirectusClient(
			jest
				.fn<typeof fetch>()
				.mockResolvedValue({ok: true, json: jest.fn().mockRejectedValue(new Error('invalid'))} as Response)
		);
		const malformedResponseClient = new ObliqueDirectusClient(
			jest.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({data: {id: 1}})))
		);
		const invalidItemClient = new ObliqueDirectusClient(
			jest.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({data: []})))
		);
		const nonObjectResponseClient = new ObliqueDirectusClient(
			jest.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(null)))
		);

		await expect(invalidJsonClient.getVersions()).rejects.toThrow('Directus returned an invalid JSON response.');
		await expect(malformedResponseClient.getVersions()).rejects.toThrow(
			'Directus returned an invalid collection response.'
		);
		await expect(invalidItemClient.getTabbedPage(1)).rejects.toThrow('Directus returned an invalid item response.');
		await expect(nonObjectResponseClient.getVersions()).rejects.toThrow(
			'Directus returned an invalid collection response.'
		);
	});

	it('aborts a request when its timeout elapses', async () => {
		jest.useFakeTimers();
		const fetchFn = jest.fn<typeof fetch>().mockImplementation((_input, init) => {
			return new Promise((_resolve, reject) => {
				init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
			});
		});
		const client = new ObliqueDirectusClient(fetchFn, 1);
		const request = client.getVersions();
		const expectedFailure = expect(request).rejects.toThrow('Unable to retrieve data from Directus.');

		await jest.advanceTimersByTimeAsync(1);
		await expectedFailure;
		jest.useRealTimers();
	});
});
