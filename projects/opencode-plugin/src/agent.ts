import type {Config} from '@opencode-ai/plugin';

import type {ObliqueProjectInfo} from './project-detector.js';

const obliqueAgentId = 'oblique';

type AgentConfiguration = Exclude<NonNullable<Config['agent']>[string], undefined>;

export function createObliqueAgentPrompt(projectInfo: ObliqueProjectInfo): string {
	const versionDetails: string[] = [];
	if (projectInfo.angularVersion !== undefined) {
		versionDetails.push(`Angular ${projectInfo.angularVersion}`);
	}
	if (projectInfo.obliqueVersion !== undefined) {
		versionDetails.push(`Oblique ${projectInfo.obliqueVersion}`);
	}

	const intro =
		versionDetails.length > 0 ? `This project uses ${versionDetails.join(' and ')}.` : 'This project uses Oblique.';

	return `${intro}\nYou are the Oblique specialist agent for this Angular project.\n- inspect the current project context and installed versions\n- use the Oblique MCP before generating Oblique UI or API code\n- search existing Oblique components before creating custom implementations\n- prefer repository patterns and Angular compatibility\n- retrieve examples, component APIs, and migration guidance from the MCP when needed\n- respect accessibility and avoid deprecated Oblique APIs\n- restrict destructive actions unless explicitly requested`;
}

export function createObliqueAgentConfiguration(projectInfo: ObliqueProjectInfo): AgentConfiguration {
	return {
		description: 'Oblique Angular specialist agent guided by the project context and MCP',
		mode: 'primary',
		prompt: createObliqueAgentPrompt(projectInfo),
	};
}

export function registerObliqueAgent(config: Config, projectInfo: ObliqueProjectInfo): void {
	if (!projectInfo.isObliqueProject) {
		return;
	}

	const existingAgents = config.agent ?? {};
	if (existingAgents[obliqueAgentId] !== undefined) {
		return;
	}

	config.agent = {...existingAgents, [obliqueAgentId]: createObliqueAgentConfiguration(projectInfo)};
}

export function obliqueAgentIdentifier(): string {
	return obliqueAgentId;
}
