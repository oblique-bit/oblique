import type {CommandV2Info} from '@opencode-ai/sdk/v2/types';

import type {ObliqueProjectInfo} from './project-detector.js';

const statusCommandName = 'oblique-status';

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

	return `${intro}\nProvide an Oblique integration status report for the current project.\n\nOutput format:\nOblique OpenCode Integration\nProject\n✓ Angular project detected\n✓ Angular: ...\n✓ Oblique: ...\n\nMCP\n✓ Oblique MCP configured\n✓ Server reachable\n✓ MCP initialized\n✓ tools/list available\n\nConfiguration\nMode: remote\nEndpoint: https://...\nPlugin: @oblique/opencode-plugin\nPlugin version: x.y.z\n\nIf an MCP check fails, provide a useful diagnostic with endpoint and reason, but never include credentials, authorization headers, or secrets.`;
}

export function registerObliqueStatusCommand(
	draft: {update: (name: string, mutate: (command: CommandV2Info) => void) => void},
	projectInfo: ObliqueProjectInfo
): void {
	if (projectInfo.isObliqueProject) {
		draft.update(statusCommandName, (command: CommandV2Info) => {
			command.name = statusCommandName;
			command.template = '/oblique-status';
			command.description = createObliqueStatusPrompt(projectInfo);
			command.agent = 'oblique';
			command.subtask = true;
		});
	}
}

export function obliqueStatusCommandName(): string {
	return statusCommandName;
}
