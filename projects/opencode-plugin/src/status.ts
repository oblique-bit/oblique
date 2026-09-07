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
	fetcher?: (url: string, init?: RequestInit) => Promise<unknown>;
	mode?: 'remote' | 'local';
	endpoint?: string;
	projectInfo?: ObliqueProjectInfo;
}

const pluginName = '@oblique/opencode-plugin';
const pluginVersion = '0.1.0';

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function sanitizeForDisplay(value: string | undefined): string | undefined {
	if (value === undefined || value.trim() === '') {
		return undefined;
	}

	try {
		const url = new URL(value);
		if (url.username || url.password) {
			url.username = '';
			url.password = '';
		}
		url.search = '';
		return url.toString();
	} catch {
		return value
			.replace(/(?:https?:\/\/)(?:[^@/]+)@/u, 'https://')
			.replace(/[?&](?:token|authorization|auth|key|secret)=[^&]+/giu, '');
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

function buildMissingEndpointReport(
	projectInfo: ObliqueProjectInfo,
	mode: 'remote' | 'local',
	endpoint: string | undefined
): ObliqueStatusReport {
	return buildObliqueStatusReport(projectInfo, {
		mcp: {
			configured: false,
			mode,
			endpoint,
			reachable: false,
			initialized: false,
			toolsAvailable: false,
			reason: 'No Oblique MCP endpoint configured for health check.',
		},
	});
}

function buildFailureReport(report: {
	projectInfo: ObliqueProjectInfo;
	mode: 'remote' | 'local';
	endpoint: string;
	reason: string;
}): ObliqueStatusReport {
	return buildObliqueStatusReport(report.projectInfo, {
		mcp: {
			configured: true,
			mode: report.mode,
			endpoint: report.endpoint,
			reachable: false,
			initialized: false,
			toolsAvailable: false,
			reason: report.reason,
		},
	});
}

function extractMcpTools(response: unknown): unknown[] {
	const payload = isRecord(response) ? response : undefined;
	const result = isRecord(payload?.['result']) ? payload['result'] : undefined;
	if (!isRecord(result) || !Array.isArray(result['tools'])) {
		return [];
	}
	return result['tools'];
}

async function performMcpHealthCheck(
	endpoint: string,
	fetcher: (url: string, init?: RequestInit) => Promise<unknown>
): Promise<unknown> {
	return fetcher(endpoint, {
		method: 'POST',
		headers: {'content-type': 'application/json'},
		body: JSON.stringify({jsonrpc: '2.0', id: 1, method: 'tools/list', params: {}}),
	});
}

export async function checkObliqueMcpHealth(
	projectInfo: ObliqueProjectInfo,
	options: ObliqueMcpHealthOptions = {}
): Promise<ObliqueStatusReport> {
	const fetcher = options.fetcher;
	const endpoint = sanitizeForDisplay(options.endpoint ?? process.env['OBLIQUE_MCP_URL']);
	const mode = options.mode ?? (endpoint === undefined ? 'local' : 'remote');
	if (fetcher === undefined || endpoint === undefined) {
		return buildMissingEndpointReport(projectInfo, mode, endpoint);
	}
	try {
		const response = await performMcpHealthCheck(endpoint, fetcher);
		const payload = isRecord(response) ? response : undefined;
		const error = isRecord(payload?.['error']) ? payload['error'] : undefined;
		if (error !== undefined) {
			const message = typeof error['message'] === 'string' ? error['message'] : 'MCP request failed.';
			return buildFailureReport({projectInfo, mode, endpoint, reason: message});
		}
		return buildObliqueStatusReport(projectInfo, {
			mcp: {
				configured: true,
				mode,
				endpoint,
				reachable: true,
				initialized: true,
				toolsAvailable: extractMcpTools(response).length > 0,
			},
		});
	} catch (error) {
		const detail = error instanceof Error ? error.message : 'Unknown connection error.';
		return buildFailureReport({projectInfo, mode, endpoint, reason: detail});
	}
}
