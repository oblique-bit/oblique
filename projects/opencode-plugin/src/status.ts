import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';

import type {ObliqueProjectInfo} from './project-detector.js';

export {createObliqueStatusPrompt, obliqueStatusCommandName, registerObliqueStatusCommand} from './status-command.js';

export type ObliqueStatusSeverity = 'ok' | 'warning' | 'error';

export interface ObliqueStatusCheck {
	project: {
		angularDetected: boolean;
		angularVersion?: string;
		obliqueDetected: boolean;
		obliqueVersion?: string;
		projectRoot?: string;
		packageManager?: string;
	};
	mcp: {
		configured: boolean;
		mode?: 'remote' | 'local';
		endpoint?: string;
		reachable: boolean;
		initialized: boolean;
		toolsAvailable: boolean;
		reason?: string;
	};
	configuration: {
		mode?: 'remote' | 'local';
		endpoint?: string;
		plugin: string;
		pluginVersion: string;
	};
}

export interface ObliqueStatusReport {
	status: ObliqueStatusSeverity;
	message: string;
	checks: ObliqueStatusCheck;
}

export interface ObliqueMcpHealthOptions {
	fetcher?: typeof fetch;
	mode?: 'remote' | 'local';
	endpoint?: string;
}

const pluginName = '@oblique/opencode-plugin';
const pluginVersion = '0.1.0';

export function sanitizeForDisplay(value: string | undefined): string | undefined {
	if (value === undefined || value.trim() === '') {
		return undefined;
	}

	try {
		const url = new URL(value);
		url.username = '';
		url.password = '';
		url.search = '';
		return url.toString();
	} catch {
		return value
			.replace(/(?:https?:\/\/)(?:[^@/]+)@/u, 'https://')
			.replace(/[?&](?:token|authorization|auth|key|secret)=[^&]+/giu, '');
	}
}

function isRemoteUrl(value: string | undefined): value is string {
	if (value === undefined || value.trim() === '') {
		return false;
	}

	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}

function createProjectLines(projectInfo: ObliqueProjectInfo): string[] {
	const angularLine = projectInfo.isAngularProject ? '✓ Angular project detected' : '✗ Angular project not detected';
	const angularVersionLine =
		projectInfo.angularVersion === undefined ? '✗ Angular version unknown' : `✓ Angular: ${projectInfo.angularVersion}`;
	const obliqueLine = projectInfo.isObliqueProject
		? `✓ Oblique: ${projectInfo.obliqueVersion ?? 'unknown version'}`
		: '✗ Oblique project not detected';
	return [angularLine, angularVersionLine, obliqueLine];
}

function createMcpLines(
	state: Pick<ObliqueStatusCheck['mcp'], 'configured' | 'reachable' | 'initialized' | 'toolsAvailable'>
): string[] {
	return [
		state.configured ? '✓ Oblique MCP configured' : '✗ Oblique MCP unavailable',
		state.reachable ? '✓ Server reachable' : '✗ Server unreachable',
		state.initialized ? '✓ MCP initialized' : '✗ MCP not initialized',
		state.toolsAvailable ? '✓ tools/list available' : '✗ tools/list unavailable',
	];
}

function createConfigurationLines(mode: 'remote' | 'local', endpoint: string | undefined): string[] {
	return [
		`Mode: ${mode}`,
		`Endpoint: ${endpoint ?? 'not configured'}`,
		`Plugin: ${pluginName}`,
		`Plugin version: ${pluginVersion}`,
	];
}

function getOverallStatus(
	projectInfo: ObliqueProjectInfo,
	state: Pick<ObliqueStatusCheck['mcp'], 'configured' | 'reachable' | 'initialized' | 'toolsAvailable'>
): ObliqueStatusSeverity {
	const isHealthy =
		projectInfo.isAngularProject &&
		projectInfo.isObliqueProject &&
		state.configured &&
		state.reachable &&
		state.initialized &&
		state.toolsAvailable;
	return isHealthy ? 'ok' : 'warning';
}

function createStatusMessage(payload: {
	projectInfo: ObliqueProjectInfo;
	state: Pick<ObliqueStatusCheck['mcp'], 'configured' | 'reachable' | 'initialized' | 'toolsAvailable'>;
	mode: 'remote' | 'local';
	endpoint: string | undefined;
}): string {
	return [
		'Oblique OpenCode Integration',
		'Project',
		...createProjectLines(payload.projectInfo),
		'',
		'MCP',
		...createMcpLines(payload.state),
		'',
		'Configuration',
		...createConfigurationLines(payload.mode, payload.endpoint),
	].join('\n');
}

function createReportChecks(payload: {
	projectInfo: ObliqueProjectInfo;
	state: Pick<ObliqueStatusCheck['mcp'], 'configured' | 'reachable' | 'initialized' | 'toolsAvailable'>;
	mode: 'remote' | 'local';
	endpoint: string | undefined;
	reason: string | undefined;
}): ObliqueStatusCheck {
	return {
		project: {
			angularDetected: payload.projectInfo.isAngularProject,
			angularVersion: payload.projectInfo.angularVersion,
			obliqueDetected: payload.projectInfo.isObliqueProject,
			obliqueVersion: payload.projectInfo.obliqueVersion,
			projectRoot: payload.projectInfo.projectRoot,
			packageManager: payload.projectInfo.packageManager,
		},
		mcp: {
			configured: payload.state.configured,
			mode: payload.mode,
			endpoint: payload.endpoint,
			reachable: payload.state.reachable,
			initialized: payload.state.initialized,
			toolsAvailable: payload.state.toolsAvailable,
			reason: payload.reason,
		},
		configuration: {
			mode: payload.mode,
			endpoint: payload.endpoint,
			plugin: pluginName,
			pluginVersion,
		},
	};
}

export function buildObliqueStatusReport(
	projectInfo: ObliqueProjectInfo,
	options: Partial<ObliqueStatusCheck> = {}
): ObliqueStatusReport {
	const mode = options.mcp?.mode ?? 'remote';
	const endpoint = sanitizeForDisplay(options.mcp?.endpoint);
	const state = {
		configured: options.mcp?.configured ?? false,
		reachable: options.mcp?.reachable ?? false,
		initialized: options.mcp?.initialized ?? false,
		toolsAvailable: options.mcp?.toolsAvailable ?? false,
	};
	return {
		status: getOverallStatus(projectInfo, state),
		message: createStatusMessage({projectInfo, state, mode, endpoint}),
		checks: createReportChecks({projectInfo, state, mode, endpoint, reason: options.mcp?.reason}),
	};
}

function buildRemoteFailureReport(
	projectInfo: ObliqueProjectInfo,
	endpoint: string | undefined,
	reason: string
): ObliqueStatusReport {
	return buildObliqueStatusReport(projectInfo, {
		mcp: {
			configured: endpoint !== undefined,
			mode: 'remote',
			endpoint,
			reachable: false,
			initialized: false,
			toolsAvailable: false,
			reason,
		},
	});
}

function buildLocalHealthReport(projectInfo: ObliqueProjectInfo): ObliqueStatusReport {
	return buildObliqueStatusReport(projectInfo, {
		mcp: {
			configured: true,
			mode: 'local',
			reachable: false,
			initialized: false,
			toolsAvailable: false,
			reason: 'Local MCP health is managed by OpenCode and cannot be independently verified here.',
		},
	});
}

async function checkRemoteMcpHealth(
	projectInfo: ObliqueProjectInfo,
	options: {configuredEndpoint: string; endpoint: string | undefined; fetcher: typeof fetch}
): Promise<ObliqueStatusReport> {
	const client = new Client({name: pluginName, version: pluginVersion});
	const transport = new StreamableHTTPClientTransport(new URL(options.configuredEndpoint), {fetch: options.fetcher});
	try {
		await client.connect(transport);
		const result = await client.listTools();
		return buildObliqueStatusReport(projectInfo, {
			mcp: {
				configured: true,
				mode: 'remote',
				endpoint: options.endpoint,
				reachable: true,
				initialized: true,
				toolsAvailable: result.tools.length > 0,
			},
		});
	} catch {
		return buildRemoteFailureReport(projectInfo, options.endpoint, 'MCP initialization or tools/list request failed.');
	} finally {
		await client.close().catch(() => undefined);
	}
}

export async function checkObliqueMcpHealth(
	projectInfo: ObliqueProjectInfo,
	options: ObliqueMcpHealthOptions = {}
): Promise<ObliqueStatusReport> {
	const mode = options.mode ?? ((options.endpoint ?? process.env['OBLIQUE_MCP_URL']) ? 'remote' : 'local');
	const configuredEndpoint = options.endpoint ?? process.env['OBLIQUE_MCP_URL'];
	const endpoint = sanitizeForDisplay(configuredEndpoint);
	if (mode === 'local') {
		return buildLocalHealthReport(projectInfo);
	}

	if (!isRemoteUrl(configuredEndpoint)) {
		return buildRemoteFailureReport(
			projectInfo,
			endpoint,
			'No valid Oblique MCP endpoint is configured for health check.'
		);
	}

	return checkRemoteMcpHealth(projectInfo, {
		configuredEndpoint,
		endpoint,
		fetcher: options.fetcher ?? globalThis.fetch,
	});
}
