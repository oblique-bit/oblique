/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 12 packaged runtime data resolution
 */

import {readFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {z as schema} from 'zod/v4';
import type {PackageMetadata} from './tools/get-oblique-version.js';

const packageMetadataSchema = schema.object({
	version: schema.string(),
	engines: schema.object({node: schema.string()}),
	dependencies: schema.record(schema.string(), schema.string()),
	repository: schema.object({url: schema.string()}),
});

export function getRuntimeDataRoot(moduleUrl: string = import.meta.url): string {
	return resolve(dirname(fileURLToPath(moduleUrl)), 'runtime-data');
}

export async function readPackageMetadata(runtimeDataRoot = getRuntimeDataRoot()): Promise<PackageMetadata> {
	const packageJsonPath = resolve(runtimeDataRoot, 'package.json');
	return packageMetadataSchema.parse(JSON.parse(await readFile(packageJsonPath, 'utf8')));
}
