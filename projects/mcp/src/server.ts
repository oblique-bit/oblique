/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 1 initial server
 */

import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {McpServer} from '@modelcontextprotocol/server';
import {serveStdio} from '@modelcontextprotocol/server/stdio';
import {z as schema} from 'zod/v4';
import {type DirectusClient, ObliqueDirectusClient} from './sources/directus/directus.client.js';
import {getObliqueComponent} from './tools/get-oblique-component.js';
import {type PackageMetadata, getObliqueMajorVersion, getObliqueVersion} from './tools/get-oblique-version.js';

const componentSchema = schema.object({
	name: schema.string().trim().min(1),
	version: schema.number().int().positive().optional(),
});

const versionResultSchema = schema.object({
	obliqueVersion: schema.string(),
	angularVersion: schema.string(),
	nodeRequirement: schema.string(),
	repository: schema.string(),
});

const componentResultSchema = schema.object({
	name: schema.string(),
	slug: schema.string(),
	api: schema.string().nullable(),
	accessibility: schema.string().nullable(),
	uiUx: schema.object({
		purpose: schema.string().nullable(),
		generalRules: schema.array(schema.string()),
		do: schema.array(schema.string()),
		doNot: schema.array(schema.string()),
		additionalInfo: schema.string().nullable(),
		relatedLinks: schema.array(schema.string()),
	}),
	version: schema.object({min: schema.number().nullable(), max: schema.number().nullable()}),
	deprecation: schema.string().nullable(),
});

const packageMetadataSchema = schema.object({
	version: schema.string(),
	engines: schema.object({node: schema.string()}),
	dependencies: schema.record(schema.string(), schema.string()),
	repository: schema.object({url: schema.string()}),
});

interface CreateServerOptions {
	directusClient?: DirectusClient;
	readPackageMetadata?: () => Promise<PackageMetadata>;
}

export function createObliqueMcpServer(options: CreateServerOptions = {}): McpServer {
	const directusClient = options.directusClient ?? new ObliqueDirectusClient();
	const packageMetadataReader = options.readPackageMetadata ?? readPackageMetadata;
	const server = new McpServer({name: 'oblique-mcp', version: '0.1.0'});
	registerVersionTool(server, packageMetadataReader);
	registerComponentTool(server, directusClient, packageMetadataReader);
	return server;
}

function registerVersionTool(server: McpServer, packageMetadataReader: () => Promise<PackageMetadata>): void {
	server.registerTool(
		'get_oblique_version',
		{
			description: 'Get version and compatibility metadata from the checked-out Oblique repository.',
			outputSchema: versionResultSchema,
		},
		async () => {
			const result = getObliqueVersion(await packageMetadataReader());
			return {content: [{type: 'text', text: JSON.stringify(result)}], structuredContent: result};
		}
	);
}

function registerComponentTool(
	server: McpServer,
	directusClient: DirectusClient,
	packageMetadataReader: () => Promise<PackageMetadata>
): void {
	server.registerTool(
		'get_oblique_component',
		{
			description: 'Get official Oblique component documentation from its Directus CMS.',
			inputSchema: componentSchema,
			outputSchema: componentResultSchema,
		},
		async ({name, version}) => {
			const selectedVersion = version ?? getObliqueMajorVersion(await packageMetadataReader());
			const result = await getObliqueComponent(directusClient, name, selectedVersion);
			if (result === undefined) {
				return {
					content: [{type: 'text', text: `No Oblique component found for "${name}".`}],
					isError: true,
				};
			}
			return {content: [{type: 'text', text: JSON.stringify(result)}], structuredContent: result};
		}
	);
}

async function readPackageMetadata(): Promise<PackageMetadata> {
	const packageJsonPath = resolve(process.cwd(), 'package.json');
	return packageMetadataSchema.parse(JSON.parse(await readFile(packageJsonPath, 'utf8')));
}

serveStdio(() => createObliqueMcpServer());
