import type {Config} from '@opencode-ai/plugin';

import type {ObliqueProjectInfo} from './project-detector.js';

const statusCommandName = 'oblique-status';

type CommandConfiguration = NonNullable<Config['command']>[string];

export function createObliqueStatusPrompt(projectInfo: ObliqueProjectInfo): string {
	const versionDetails: string[] = [];
	if (typeof projectInfo.angularVersion === 'string') {
		versionDetails.push(`Angular ${projectInfo.angularVersion}`);
	}
	if (typeof projectInfo.obliqueVersion === 'string') {
		versionDetails.push(`Oblique ${projectInfo.obliqueVersion}`);
	}

	const intro =
		versionDetails.length > 0 ? `This project uses ${versionDetails.join(' and ')}.` : 'This project uses Oblique.';

	return `${intro}\nProvide an Oblique integration status report for the current project.\n\nOutput format:\nOblique OpenCode Integration\nProject\n✓ Angular project detected\n✓ Angular: ...\n✓ Oblique: ...\n\nMCP\n✓ Oblique MCP configured\n✓ Server reachable\n✓ MCP initialized\n✓ tools/list available\n\nConfiguration\nMode: remote\nEndpoint: https://...\nPlugin: @oblique/opencode-plugin\nPlugin version: x.y.z\n\nOnly report MCP initialization or tools/list availability after a protocol-correct MCP client check. If an MCP check fails, provide a useful diagnostic with the sanitized endpoint and reason, but never include credentials, authorization headers, or secrets.`;
}

export function createObliqueStatusCommandConfiguration(projectInfo: ObliqueProjectInfo): CommandConfiguration {
	return {
		template: '/oblique-status',
		description: createObliqueStatusPrompt(projectInfo),
		agent: 'oblique',
		subtask: true,
	};
}

export function registerObliqueStatusCommand(config: Config, projectInfo: ObliqueProjectInfo): void {
	if (!projectInfo.isObliqueProject) {
		return;
	}

	const existingCommands = config.command ?? {};
	if (existingCommands[statusCommandName] !== undefined) {
		return;
	}

	config.command = {...existingCommands, [statusCommandName]: createObliqueStatusCommandConfiguration(projectInfo)};
}

export function obliqueStatusCommandName(): string {
	return statusCommandName;
}
