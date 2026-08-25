/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 2 search and examples
 */

import {SdsExamplesReader} from './sds-examples.reader.js';
import {resolve} from 'node:path';

const repositoryRoot = '/repository';
const codeExamplesPath = `${repositoryRoot}/projects/sds/src/app/code-examples`;
const mapperPath = `${codeExamplesPath}/code-examples.mapper.ts`;
const buttonPath = `${codeExamplesPath}/code-examples/button/button-code-examples.component.ts`;

const mapperSource = `
import {ButtonCodeExamplesComponent} from './code-examples/button/button-code-examples.component';
import {EmptyCodeExamplesComponent} from './code-examples/empty/empty-code-examples.component';
const codeExamples = {button: ButtonCodeExamplesComponent, empty: EmptyCodeExamplesComponent};`;

const buttonSource = `class ButtonCodeExamplesComponent { readonly previews: CodeExample[] = [
{
 idParts: ['colors'], title: 'Colors', snippets: [
 this.getSnippet('button', 'colors/button.component.html', 'HTML'),
 this.getSnippet('button', 'colors/button.component.ts', 'TS'),
 this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')]
},
{
 idParts: ['other', 'options'], title: 'Other options', snippets: [
 this.getSnippet('button', 'other/button.component.html', 'HTML')]
}]; }`;

function createReader(files: Record<string, string>): SdsExamplesReader {
	return new SdsExamplesReader(repositoryRoot, async path => {
		const source = files[path];
		if (source === undefined) {
			throw new Error(`Missing fixture ${path}.`);
		}
		return source;
	});
}

function createButtonReader(): SdsExamplesReader {
	return createReader({
		[mapperPath]: mapperSource,
		[buttonPath]: buttonSource,
		[`${codeExamplesPath}/code-examples/button/previews/colors/button.component.html`]: '<button>Colors</button>',
		[`${codeExamplesPath}/code-examples/button/previews/colors/button.component.ts`]:
			"import {Thing} from '../../../thing';",
		[`${codeExamplesPath}/code-example-flex-layout.scss`]: '@use "@oblique/oblique/src/styles/scss/core";',
		[`${codeExamplesPath}/code-examples/button/previews/other/button.component.html`]: '<button>Other</button>',
	});
}

describe('SdsExamplesReader', () => {
	it('reads multiple Button examples and SDS-normalized snippets', async () => {
		await expect(createButtonReader().getExamples('button')).resolves.toEqual({
			component: 'button',
			examples: [
				{
					id: 'colors',
					title: 'Colors',
					snippets: [
						{
							language: 'html',
							title: 'HTML',
							path: 'projects/sds/src/app/code-examples/code-examples/button/previews/colors/button.component.html',
							content: '<button>Colors</button>',
						},
						{
							language: 'typescript',
							title: 'TS',
							path: 'projects/sds/src/app/code-examples/code-examples/button/previews/colors/button.component.ts',
							content: "import {Thing} from './thing';",
						},
						{
							language: 'scss',
							title: 'Flex Layout',
							path: 'projects/sds/src/app/code-examples/code-example-flex-layout.scss',
							content: '@use "@oblique/oblique/styles/scss/core";',
						},
					],
				},
				{
					id: 'other-options',
					title: 'Other options',
					snippets: [
						{
							language: 'html',
							title: 'HTML',
							path: 'projects/sds/src/app/code-examples/code-examples/button/previews/other/button.component.html',
							content: '<button>Other</button>',
						},
					],
				},
			],
		});
	});

	it('uses the SDS fallback from a version-suffixed slug', async () => {
		await expect(createButtonReader().getExamples('BUTTON-15')).resolves.toMatchObject({component: 'button'});
	});

	it('parses mapper and previews structurally despite normal TypeScript formatting changes', async () => {
		const reader = createReader({
			[mapperPath]: `
				import {
					ButtonCodeExamplesComponent as LocalButtonExamples,
				} from "./code-examples/button/button-code-examples.component";
				const codeExamples = {
					"button": LocalButtonExamples,
				};`,
			[buttonPath]: `
				class ButtonCodeExamplesComponent {
					readonly directory = "button";
					readonly previews = [
						{
							snippets: [this.getSnippet(this.directory, "colors/button.component.html", "HTML")],
							title: "Colors",
							idParts: ["colors"],
						},
					];
				}`,
			[`${codeExamplesPath}/code-examples/button/previews/colors/button.component.html`]: '<button>Colors</button>',
		});

		await expect(reader.getExamples('BUTTON')).resolves.toEqual({
			component: 'button',
			examples: [
				{
					id: 'colors',
					title: 'Colors',
					snippets: [
						{
							language: 'html',
							title: 'HTML',
							path: 'projects/sds/src/app/code-examples/code-examples/button/previews/colors/button.component.html',
							content: '<button>Colors</button>',
						},
					],
				},
			],
		});
	});

	it('returns no examples for an unknown or unsafe component identifier', async () => {
		const reader = createButtonReader();

		await expect(reader.getExamples('unknown')).resolves.toBeUndefined();
		await expect(reader.getExamples('../button')).resolves.toBeUndefined();
	});

	it.each([
		'../',
		'../../package.json',
		'/button/../../../package.json',
		'/etc/passwd',
		'C:\\Windows\\System32\\drivers\\etc\\hosts',
		'C:/Windows/System32/drivers/etc/hosts',
		'%2e%2e%2fpackage.json',
	])('does not read any file for traversal-shaped external input %s', async component => {
		const readSourceFile = jest.fn(async () => '');
		const reader = new SdsExamplesReader(repositoryRoot, readSourceFile);

		await expect(reader.getExamples(component)).resolves.toBeUndefined();
		expect(readSourceFile).not.toHaveBeenCalled();
	});

	it('returns a known component with no examples as an empty list', async () => {
		const emptyPath = `${codeExamplesPath}/code-examples/empty/empty-code-examples.component.ts`;
		const reader = createReader({
			[mapperPath]: mapperSource,
			[emptyPath]: 'export class EmptyCodeExamplesComponent {}',
		});

		await expect(reader.getExamples('empty')).resolves.toEqual({component: 'empty', examples: []});
	});

	it('rejects a mapper import that escapes the code examples directory', async () => {
		const reader = createReader({
			[mapperPath]:
				"import {UnsafeExamplesComponent} from '../unsafe'; const codeExamples = {unsafe: UnsafeExamplesComponent};",
		});

		await expect(reader.getExamples('unsafe')).rejects.toThrow('escapes the code examples directory');
	});

	it('rejects an unsafe path declared by an SDS example before reading the target', async () => {
		const emptyPath = `${codeExamplesPath}/code-examples/empty/empty-code-examples.component.ts`;
		const readSourceFile = jest.fn(async (path: string) => {
			if (path === mapperPath) {
				return mapperSource;
			}
			if (path === emptyPath) {
				return "class EmptyCodeExamplesComponent { readonly previews = [{idParts: ['unsafe'], snippets: [this.getSnippet('../../outside', 'package.json', 'JSON')]}]; }";
			}
			throw new Error(`Unexpected source read: ${path}`);
		});
		const reader = new SdsExamplesReader(repositoryRoot, readSourceFile);

		await expect(reader.getExamples('empty')).rejects.toThrow('escapes the code examples directory');
		expect(readSourceFile).toHaveBeenCalledTimes(2);
	});

	it('uses the repository reader by default', async () => {
		await expect(
			new SdsExamplesReader(resolve(process.cwd(), '../..')).getExamples('not-a-real-component')
		).resolves.toBeUndefined();
	});

	it('uses the default repository root without reading unsafe component input', async () => {
		expect(new SdsExamplesReader(undefined, async () => '')).toBeInstanceOf(SdsExamplesReader);
		await expect(new SdsExamplesReader(undefined, async () => '').getExamples('../unsafe')).resolves.toBeUndefined();
	});

	it('handles an unfinished previews declaration as no examples', async () => {
		const emptyPath = `${codeExamplesPath}/code-examples/empty/empty-code-examples.component.ts`;
		const reader = createReader({
			[mapperPath]: mapperSource,
			[emptyPath]: 'class EmptyCodeExamplesComponent { readonly previews = [',
		});

		await expect(reader.getExamples('empty')).resolves.toEqual({component: 'empty', examples: []});
	});

	it('returns no examples when a mapper class has no import', async () => {
		const reader = createReader({[mapperPath]: 'const codeExamples = {missing: MissingCodeExamplesComponent};'});

		await expect(reader.getExamples('missing')).resolves.toBeUndefined();
	});

	it('returns no examples when the mapper has no codeExamples object', async () => {
		const reader = createReader({[mapperPath]: 'const unrelated = {button: ButtonCodeExamplesComponent};'});

		await expect(reader.getExamples('button')).resolves.toBeUndefined();
	});

	it('supports an explicit TypeScript mapper import and ignores computed mapping keys', async () => {
		const reader = createReader({
			[mapperPath]: `
				import {ButtonCodeExamplesComponent} from './code-examples/button/button-code-examples.component.ts';
				const codeExamples = {[dynamicName]: ButtonCodeExamplesComponent, button: ButtonCodeExamplesComponent};`,
			[buttonPath]: 'class ButtonCodeExamplesComponent {}',
		});

		await expect(reader.getExamples('button')).resolves.toEqual({component: 'button', examples: []});
	});

	it('ignores unsupported mapper members and dynamic preview expressions', async () => {
		const emptyPath = `${codeExamplesPath}/code-examples/empty/empty-code-examples.component.ts`;
		const reader = createReader({
			[mapperPath]: `
				import {EmptyCodeExamplesComponent} from './code-examples/empty/empty-code-examples.component';
				const codeExamples = {get ignored() { return EmptyCodeExamplesComponent; }, empty: EmptyCodeExamplesComponent};`,
			[emptyPath]: `
				class EmptyCodeExamplesComponent {
					readonly previews = [42, {idParts: ['ignored'], snippets: [42, this.notSnippet('a', 'b', 'c'), this.getSnippet('a', 'b'), this.getSnippet(dynamicDirectory, 'b', 'c')]}];
				}`,
		});

		await expect(reader.getExamples('empty')).resolves.toEqual({
			component: 'empty',
			examples: [{id: 'ignored', title: 'ignored', snippets: []}],
		});
	});

	it('uses empty identifiers and titles when an example omits them', async () => {
		const emptyPath = `${codeExamplesPath}/code-examples/empty/empty-code-examples.component.ts`;
		const reader = createReader({
			[mapperPath]: mapperSource,
			[emptyPath]: 'class EmptyCodeExamplesComponent { readonly previews = [{snippets: []}]; }',
		});

		await expect(reader.getExamples('empty')).resolves.toEqual({
			component: 'empty',
			examples: [{id: '', title: '', snippets: []}],
		});
	});

	it('keeps an example with no snippets declaration', async () => {
		const emptyPath = `${codeExamplesPath}/code-examples/empty/empty-code-examples.component.ts`;
		const reader = createReader({
			[mapperPath]: mapperSource,
			[emptyPath]: "class EmptyCodeExamplesComponent { readonly previews = [{idParts: ['no-snippets']}]; }",
		});

		await expect(reader.getExamples('empty')).resolves.toEqual({
			component: 'empty',
			examples: [{id: 'no-snippets', title: 'no-snippets', snippets: []}],
		});
	});

	it('keeps nested preview object content within one example', async () => {
		const emptyPath = `${codeExamplesPath}/code-examples/empty/empty-code-examples.component.ts`;
		const reader = createReader({
			[mapperPath]: mapperSource,
			[emptyPath]:
				"class EmptyCodeExamplesComponent { readonly previews = [{idParts: ['nested'], snippets: [], metadata: {enabled: true}}]; }",
		});

		await expect(reader.getExamples('empty')).resolves.toEqual({
			component: 'empty',
			examples: [{id: 'nested', title: 'nested', snippets: []}],
		});
	});

	it('reads directory-backed and JSON snippets using SDS conventions', async () => {
		const chipsPath = `${codeExamplesPath}/code-examples/chips/chips-code-examples.component.ts`;
		const reader = createReader({
			[mapperPath]: `
				import {ChipsCodeExamplesComponent} from './code-examples/chips/chips-code-examples.component';
				const codeExamples = {chips: ChipsCodeExamplesComponent};`,
			[chipsPath]:
				"class ChipsCodeExamplesComponent { readonly directory: string = 'chips'; readonly previews: CodeExample[] = [{idParts: ['default'], snippets: [this.getSnippet(this.directory, 'default/example.html', 'HTML'), this.getJsonSnippet('i18n', 'en.json', 'JSON'), this.getJsonSnippet('oblique/src/assets/i18n', 'oblique-en.json', 'Oblique JSON')]}]; }",
			[`${codeExamplesPath}/code-examples/chips/previews/default/example.html`]: '<p>Chips</p>',
			[`${repositoryRoot}/projects/sds/src/assets/i18n/en.json`]: '{"key":"value"}',
			[`${repositoryRoot}/projects/oblique/src/assets/i18n/oblique-en.json`]: '{"oblique":"value"}',
		});

		await expect(reader.getExamples('chips')).resolves.toEqual({
			component: 'chips',
			examples: [
				{
					id: 'default',
					title: 'default',
					snippets: [
						{
							language: 'html',
							title: 'HTML',
							path: 'projects/sds/src/app/code-examples/code-examples/chips/previews/default/example.html',
							content: '<p>Chips</p>',
						},
						{
							language: 'json',
							title: 'JSON',
							path: 'projects/sds/src/assets/i18n/en.json',
							content: '{\n  "key": "value"\n}',
						},
						{
							language: 'json',
							title: 'Oblique JSON',
							path: 'projects/oblique/src/assets/i18n/oblique-en.json',
							content: '{\n  "oblique": "value"\n}',
						},
					],
				},
			],
		});
	});

	it('uses an empty directory only for a source declaration that omits it', async () => {
		const emptyPath = `${codeExamplesPath}/code-examples/empty/empty-code-examples.component.ts`;
		const reader = createReader({
			[mapperPath]: mapperSource,
			[emptyPath]:
				"class EmptyCodeExamplesComponent { readonly previews = [{idParts: ['default'], snippets: [this.getSnippet(this.directory, 'default/example.html', 'HTML')]}]; }",
			[`${codeExamplesPath}/code-examples/previews/default/example.html`]: '<p>Default</p>',
		});

		await expect(reader.getExamples('empty')).resolves.toMatchObject({
			examples: [
				{snippets: [{path: 'projects/sds/src/app/code-examples/code-examples/previews/default/example.html'}]},
			],
		});
	});
});
