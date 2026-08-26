/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 6 Design System token reader tests
 */

import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {
	type DesignTokenSourceReader,
	ObliqueDesignTokenReader,
	ObliqueDesignTokenSourceError,
} from './design-token.reader.js';

const fixturePath = resolve(__dirname, '../../../fixtures/design-tokens/tokens.css');
const tokenSourceRelativePath = 'projects/design-system/src/lib/css/layers/tokens.css';

async function readFixture(): Promise<string> {
	return readFile(fixturePath, 'utf8');
}

function createReader(readTokenSource: DesignTokenSourceReader = async () => readFixture()): ObliqueDesignTokenReader {
	return new ObliqueDesignTokenReader('/repository', readTokenSource);
}

describe('ObliqueDesignTokenReader', () => {
	it('indexes semantic, HTML, component and unknown tokens from generated CSS', async () => {
		const reader = createReader();

		expect(await reader.getStatistics()).toEqual({total: 7, semantic: 4, html: 1, component: 1, unknown: 1});
		const result = await reader.search('example', 'all', 20);

		expect(result.results).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: '--ob-s-color-example',
					tier: 'semantic',
					usableByProjects: true,
					value: '#ffffff',
					source: tokenSourceRelativePath,
				}),
				expect.objectContaining({name: '--ob-h-button-example', tier: 'html', usableByProjects: false}),
				expect.objectContaining({name: '--ob-c-button-example', tier: 'component', usableByProjects: false}),
				expect.objectContaining({name: '--custom-example', tier: 'unknown', usableByProjects: false}),
			])
		);
	});

	it('preserves multiline values, direct var references and selector-specific overrides', async () => {
		const reader = createReader();
		const multiline = (await reader.search('--ob-s-multiline-example', 'project', 20)).results[0];
		const color = (await reader.search('--ob-s-color-example', 'project', 20)).results[0];
		const spacing = (await reader.search('--ob-s-spacing-example', 'project', 20)).results[0];

		expect(multiline).toMatchObject({
			value:
				'var(\n\t\t--ob-s-color-example,\n\t\tlinear-gradient(to right, #000000 0%, #ffffff 50%, #123456 100%, #abcdef 150%, #fedcba 200%)\n\t)',
			references: ['--ob-s-color-example'],
		});
		expect(color?.overrides).toEqual([
			{selector: '.ob-dark', value: 'var(--ob-s-shadow-example)', references: ['--ob-s-shadow-example']},
		]);
		expect(spacing?.overrides).toEqual([
			{selector: '@media (prefers-reduced-motion: reduce) :root', value: '0', references: []},
		]);
	});

	it('defaults to project-safe semantic tokens and exposes internal tokens only with all scope', async () => {
		const reader = createReader();

		expect(await reader.search('button', 'project', 20)).toMatchObject({total: 0, results: []});
		expect(await reader.search('button', 'all', 20)).toMatchObject({
			total: 2,
			results: [
				expect.objectContaining({name: '--ob-c-button-example', usableByProjects: false}),
				expect.objectContaining({name: '--ob-h-button-example', usableByProjects: false}),
			],
		});
	});

	it('ranks exact token names first and returns deterministic lexical results before applying the limit', async () => {
		const reader = createReader();
		const exact = await reader.search('--ob-s-color-example', 'project', 20);
		const normalizedExact = await reader.search('ob s color example', 'project', 20);
		const limited = await reader.search('example', 'all', 2);

		expect(exact.results[0]).toMatchObject({name: '--ob-s-color-example', tier: 'semantic'});
		expect(normalizedExact.results[0]).toMatchObject({name: '--ob-s-color-example'});
		expect(limited).toMatchObject({total: 7, results: [{name: '--custom-example'}, {name: '--ob-c-button-example'}]});
	});

	it('supports normalized multi-term queries and returns no result for unknown concepts', async () => {
		const reader = createReader();

		expect((await reader.search('spacing-example', 'project', 20)).results[0]).toMatchObject({
			name: '--ob-s-spacing-example',
		});
		expect(await reader.search('does not exist', 'all', 20)).toEqual({
			query: 'does not exist',
			scope: 'all',
			total: 0,
			results: [],
		});
	});

	it('parses quoted values, fallback var calls and tokens without root declarations', async () => {
		const reader = createReader(
			async () => `
			/* first line
			 * second line */
			:root {
				--ob-s-quoted: "value: \\"quoted\\"";
				--ob-s-function: image-set("icon:dark" 1x);
				--ob-s-non-token-reference: var(color, #fff);
			}
			.ob-mode { --ob-s-mode-only: 2px; }
		`
		);

		expect((await reader.search('quoted', 'project', 20)).results[0]).toMatchObject({
			value: '"value: \\"quoted\\""',
		});
		expect((await reader.search('function', 'project', 20)).results[0]).toMatchObject({
			value: 'image-set("icon:dark" 1x)',
		});
		expect((await reader.search('non token reference', 'project', 20)).results[0]).toMatchObject({references: []});
		expect((await reader.search('mode only', 'project', 20)).results[0]).toMatchObject({
			value: '2px',
			overrides: [],
		});
	});

	it('loads and indexes the authoritative source only once per reader', async () => {
		const readTokenSource = jest.fn(async () => readFixture());
		const reader = createReader(readTokenSource);

		await reader.search('color', 'project', 20);
		await reader.search('spacing', 'project', 20);
		await reader.search('button', 'all', 20);

		expect(readTokenSource).toHaveBeenCalledTimes(1);
		expect(readTokenSource).toHaveBeenCalledWith(resolve('/repository', tokenSourceRelativePath));
	});

	it('fails predictably for malformed or unreadable generated CSS', async () => {
		await expect(
			createReader(async () => ':root { --ob-s-color: var(--ob-s-other);').search('color', 'project', 20)
		).rejects.toThrow(ObliqueDesignTokenSourceError);
		await expect(createReader(async () => '/* unclosed').search('color', 'project', 20)).rejects.toThrow(
			ObliqueDesignTokenSourceError
		);
		await Promise.all(
			[
				':root { --ob-s-color: "unclosed; }',
				[':root { --ob-s-color: "value', '\\'].join(''),
				':root { --ob-s-color: value); }',
				'{ --ob-s-color: #fff; }',
				'}',
				':root { --ob-s-color }',
				':root { --ob-s-color: ; }',
			].map(async malformedSource =>
				expect(createReader(async () => malformedSource).search('color', 'project', 20)).rejects.toThrow(
					ObliqueDesignTokenSourceError
				)
			)
		);
		await expect(
			createReader(async () => Promise.reject(new Error('unreadable'))).search('color', 'project', 20)
		).rejects.toThrow('Unable to read the generated Oblique Design System token source.');
	});

	it('reads the actual checked-out generated Design System source without hardcoded inventory assumptions', async () => {
		const reader = new ObliqueDesignTokenReader(resolve(__dirname, '../../../../..'));
		const statistics = await reader.getStatistics();
		const color = await reader.search('color', 'project', 20);
		const internal = await reader.search('--ob-h', 'all', 20);

		expect(statistics.total).toBeGreaterThan(0);
		expect(statistics.semantic).toBeGreaterThan(0);
		expect(color.results.every(token => token.usableByProjects && token.tier === 'semantic')).toBe(true);
		const internalToken = internal.results.find(token => token.tier === 'html');
		expect(internalToken).toBeDefined();
		if (internalToken !== undefined) {
			expect((await reader.search(internalToken.name, 'project', 20)).results).not.toContainEqual(internalToken);
		}
	});

	it('uses the process working directory only when no repository root is supplied', async () => {
		const repositoryRoot = resolve(__dirname, '../../../../..');
		const initialWorkingDirectory = process.cwd();
		process.chdir(repositoryRoot);
		try {
			expect((await new ObliqueDesignTokenReader().getStatistics()).total).toBeGreaterThan(0);
		} finally {
			process.chdir(initialWorkingDirectory);
		}
	});
});
