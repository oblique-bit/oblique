import type {Config} from '@opencode-ai/plugin';
import type {McpLocalConfig, McpRemoteConfig} from '@opencode-ai/sdk';

export type ObliqueMcpMode = 'remote' | 'local';

export interface ObliqueMcpConfiguration {
	mode: ObliqueMcpMode;
	url?: string;
	command?: string[];
	environment?: Record<string, string>;
	enabled?: boolean;
}

export interface ObliqueMcpResolutionOptions {
	mode?: ObliqueMcpMode;
	url?: string;
	command?: string[];
	environment?: Record<string, string>;
	enabled?: boolean;
	env?: Record<string, string | undefined>;
}

const remoteMode = 'remote';
const localMode = 'local';

function isRemoteUrl(value: string | undefined): boolean {
	if (typeof value !== 'string' || value.trim() === '') {
		return false;
	}

	try {
		const candidate = new URL(value.trim());
		return candidate.protocol === 'http:' || candidate.protocol === 'https:';
	} catch {
		return false;
	}
}

function normalizeMode(mode: string | undefined): ObliqueMcpMode {
	if (mode === localMode) {
		return localMode;
	}
	return remoteMode;
}

function getEnvironmentValue(env: Record<string, string | undefined> | undefined, name: string): string | undefined {
	const value = env?.[name];
	return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}

export function resolveObliqueMcpConfiguration(
	options: ObliqueMcpResolutionOptions = {}
): ObliqueMcpConfiguration | undefined {
	const env = options.env ?? process.env;
	const mode = normalizeMode(getEnvironmentValue(env, 'OBLIQUE_MCP_MODE') ?? options.mode ?? remoteMode);
	const configuredUrl = getEnvironmentValue(env, 'OBLIQUE_MCP_URL') ?? options.url;

	if (mode === localMode) {
		const command = options.command ?? parseLocalCommandValue(env);
		if (command === undefined || command.length === 0) {
			return undefined;
		}
		return {
			mode: localMode,
			command,
			environment: options.environment ?? getEnvironmentMap(env),
			enabled: options.enabled ?? true,
		};
	}

	if (!isRemoteUrl(configuredUrl)) {
		return undefined;
	}

	return {
		mode: remoteMode,
		url: configuredUrl,
		enabled: options.enabled ?? true,
	};
}

function parseLocalCommandValue(env: Record<string, string | undefined>): string[] | undefined {
	const command = getEnvironmentValue(env, 'OBLIQUE_MCP_COMMAND');
	if (command === undefined) {
		return undefined;
	}

	const args = getEnvironmentValue(env, 'OBLIQUE_MCP_ARGS');
	if (args === undefined) {
		return [command];
	}

	return [command, ...splitCommandArgs(args)];
}

function splitCommandArgs(value: string): string[] {
	return value
		.split(/\s+/u)
		.map(argument => argument.trim())
		.filter(argument => argument.length > 0);
}

function getEnvironmentMap(env: Record<string, string | undefined>): Record<string, string> {
	const output: Record<string, string> = {};
	for (const [key, value] of Object.entries(env)) {
		if (typeof value === 'string' && value.trim() !== '') {
			output[key] = value;
		}
	}
	return output;
}

export function applyObliqueMcpConfiguration(config: Config, options: ObliqueMcpResolutionOptions = {}): Config {
	const existingMcpConfig = config.mcp ?? {};
	if (existingMcpConfig['oblique'] !== undefined) {
		return config;
	}

	const resolved = resolveObliqueMcpConfiguration(options);
	if (resolved === undefined) {
		return config;
	}

	const nextMcpConfig: Record<string, McpLocalConfig | McpRemoteConfig> = {...existingMcpConfig};
	if (resolved.mode === localMode) {
		const localConfig: McpLocalConfig = {
			type: 'local',
			command: resolved.command ?? [],
			enabled: resolved.enabled ?? true,
			environment: resolved.environment,
		};
		nextMcpConfig['oblique'] = localConfig;
	} else {
		const remoteConfig: McpRemoteConfig = {
			type: 'remote',
			url: resolved.url ?? '',
			enabled: resolved.enabled ?? true,
		};
		nextMcpConfig['oblique'] = remoteConfig;
	}

	config.mcp = nextMcpConfig;
	return config;
}
