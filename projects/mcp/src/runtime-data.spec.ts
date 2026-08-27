/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 12 packaged runtime data regression tests
 */

import {readFile, stat} from 'node:fs/promises';
import {execFile as execFileCallback} from 'node:child_process';
import {resolve} from 'node:path';
import {promisify} from 'node:util';
import * as typescript from 'typescript';
import {SdsExamplesReader} from './sources/sds/sds-examples.reader.js';

const execFile = promisify(execFileCallback);
const repositoryRoot = resolve(__dirname, '../../..');
const packagedRuntimeDataRoot = resolve(repositoryRoot, 'projects/mcp/dist/runtime-data');

describe('packaged runtime data', () => {
	it('uses import-meta-relative runtime data and package metadata instead of the process cwd', async () => {
		const runtimeDataSource = await readFile(resolve(repositoryRoot, 'projects/mcp/src/runtime-data.ts'), 'utf8');

		expect(runtimeDataSource).toContain('fileURLToPath(moduleUrl)');
		expect(runtimeDataSource).toContain("resolve(dirname(fileURLToPath(moduleUrl)), 'runtime-data')");
		expect(runtimeDataSource).toContain("resolve(runtimeDataRoot, 'package.json')");
		expect(runtimeDataSource).not.toContain('process.cwd()');
	});

	it('generates the required repository-relative snapshot and resolves every mapper component', async () => {
		await execFile('node', ['projects/mcp/scripts/prepare-runtime-data.mjs'], {cwd: repositoryRoot});
		await expect(stat(resolve(packagedRuntimeDataRoot, 'package.json'))).resolves.toBeDefined();
		await expect(stat(resolve(packagedRuntimeDataRoot, 'projects/oblique/src/public_api.ts'))).resolves.toBeDefined();
		await expect(
			stat(resolve(packagedRuntimeDataRoot, 'projects/oblique/schematics/index/ng-update/index.ts'))
		).resolves.toBeDefined();
		await expect(
			stat(resolve(packagedRuntimeDataRoot, 'projects/design-system/src/lib/css/layers/tokens.css'))
		).resolves.toBeDefined();

		const mapperSource = await readPackageMetadataSource(
			resolve(packagedRuntimeDataRoot, 'projects/sds/src/app/code-examples/code-examples.mapper.ts')
		);
		const components = getMappedComponents(mapperSource);
		const reader = new SdsExamplesReader(packagedRuntimeDataRoot);
		const examples = await Promise.all(components.map(component => reader.getExamples(component)));

		expect(components).toHaveLength(54);
		expect(examples).not.toContain(undefined);
	});

	it('keeps the twelve registered MCP tools', () => {
		const serverSource = readFile(resolve(repositoryRoot, 'projects/mcp/src/server.ts'), 'utf8');

		return expect(serverSource).resolves.toMatch(/registerTool\(/gu);
	});

	it('wires the server defaults to one runtime-data reader factory without a cwd root', async () => {
		const serverSource = await readFile(resolve(repositoryRoot, 'projects/mcp/src/server.ts'), 'utf8');
		const toolRegistrationCalls = [
			'registerVersionTool',
			'registerComponentTool',
			'registerSearchTool',
			'registerExamplesTool',
			'registerPublicApiTool',
			'registerMigrationTool',
			'registerObliqueCodeTool',
			'registerDesignTokenSearchTool',
			'registerObliqueStylesTool',
			'registerObliqueTemplateTool',
			'registerObliqueTemplateApiTool',
			'registerPrepareObliqueProjectTool',
		];

		expect(toolRegistrationCalls).toHaveLength(12);
		for (const toolRegistrationCall of toolRegistrationCalls) {
			expect(serverSource).toContain(`${toolRegistrationCall}(server`);
		}
		expect(serverSource).toContain('const runtimeDataReaders = createRuntimeDataReaders();');
		expect(serverSource).not.toContain('process.cwd()');
	});
});

async function readPackageMetadataSource(path: string): Promise<string> {
	return readFile(path, 'utf8');
}

function getMappedComponents(mapperSource: string): string[] {
	const sourceFile = typescript.createSourceFile(
		'code-examples.mapper.ts',
		mapperSource,
		typescript.ScriptTarget.Latest
	);
	const initializer = sourceFile.statements
		.filter(typescript.isVariableStatement)
		.flatMap(statement => statement.declarationList.declarations)
		.find(candidate => typescript.isIdentifier(candidate.name) && candidate.name.text === 'codeExamples')?.initializer;
	if (!typescript.isObjectLiteralExpression(initializer)) {
		throw new Error('Unable to find the SDS code example mapping.');
	}
	return initializer.properties.flatMap(property => {
		if (!typescript.isPropertyAssignment(property)) {
			return [];
		}
		return typescript.isIdentifier(property.name) || typescript.isStringLiteral(property.name)
			? [property.name.text]
			: [];
	});
}
