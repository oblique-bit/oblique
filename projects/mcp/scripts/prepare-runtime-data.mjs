#!/usr/bin/env node
/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 12 build generated runtime source snapshot
 */

import {cp, mkdir, rm, stat} from 'node:fs/promises';
import {dirname, relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '../../..');
const packageRoot = resolve(scriptDirectory, '..');
const runtimeRoot = resolve(packageRoot, 'dist/runtime-data');

const sources = [
	['package.json', 'package.json'],
	// The entire public API TypeScript source closure is rooted in src.
	['projects/oblique/src', 'projects/oblique/src'],
	// ng-update imports the sibling utility and ng-add sources from index.
	['projects/oblique/schematics/index', 'projects/oblique/schematics/index'],
	// The reader resolves mapper imports and all preview snippets from this source root.
	['projects/sds/src/app/code-examples', 'projects/sds/src/app/code-examples'],
	// JSON snippets with the i18n directory resolve from this source root.
	['projects/sds/src/assets/i18n', 'projects/sds/src/assets/i18n'],
	['projects/design-system/src/lib/css/layers/tokens.css', 'projects/design-system/src/lib/css/layers/tokens.css'],
];

await rm(runtimeRoot, {recursive: true, force: true});
await mkdir(runtimeRoot, {recursive: true});

for (const [sourceRelativePath, destinationRelativePath] of sources) {
	const sourcePath = assertRepositoryPath(sourceRelativePath);
	const destinationPath = assertRuntimePath(destinationRelativePath);
	try {
		await stat(sourcePath);
	} catch {
		throw new Error(`Required MCP runtime source is missing: ${sourceRelativePath}`);
	}
	await cp(sourcePath, destinationPath, {
		recursive: true,
		filter: source => isApprovedSourcePath(source),
	});
}

console.log(`Prepared MCP runtime data in ${runtimeRoot}`);

function assertRepositoryPath(sourceRelativePath) {
	const sourcePath = resolve(repositoryRoot, sourceRelativePath);
	if (!isInside(repositoryRoot, sourcePath)) {
		throw new Error(`MCP runtime source is outside the repository: ${sourceRelativePath}`);
	}
	return sourcePath;
}

function assertRuntimePath(destinationRelativePath) {
	const destinationPath = resolve(runtimeRoot, destinationRelativePath);
	if (!isInside(runtimeRoot, destinationPath)) {
		throw new Error(`MCP runtime destination is outside dist/runtime-data: ${destinationRelativePath}`);
	}
	return destinationPath;
}

function isInside(root, target) {
	const pathRelative = relative(root, target);
	return pathRelative === '' || (!pathRelative.startsWith(`..${sep}`) && pathRelative !== '..');
}

function isApprovedSourcePath(sourcePath) {
	const pathRelative = relative(repositoryRoot, sourcePath);
	const fileName = pathRelative.split(sep).at(-1) ?? '';
	return (
		!pathRelative.split(sep).some(segment => segment === '.git' || segment === 'node_modules' || segment === 'dist') &&
		!fileName.startsWith('.env') &&
		!fileName.endsWith('.pem') &&
		!fileName.endsWith('.key') &&
		!/\.spec(?:[-.]|$)|\.test(?:[-.]|$)/u.test(fileName)
	);
}
