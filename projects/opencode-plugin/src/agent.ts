import type {AgentDraft} from '@opencode-ai/plugin/v2/promise';
import type {AgentV2Info} from '@opencode-ai/sdk/v2/types';

import type {ObliqueProjectInfo} from './project-detector.js';

const obliqueAgentId = 'oblique';

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

export function registerObliqueAgent(draft: Pick<AgentDraft, 'update'>, projectInfo: ObliqueProjectInfo): void {
	if (!projectInfo.isObliqueProject) {
		return;
	}

	const prompt = createObliqueAgentPrompt(projectInfo);
	draft.update(obliqueAgentId, (agent: AgentV2Info) => {
		agent.id = obliqueAgentId;
		agent.mode = 'primary';
		agent.hidden = false;
		agent.description = 'Oblique Angular specialist agent guided by the project context and MCP';
		agent.system = prompt;
		agent.request = {
			headers: {},
			body: {},
		};
		agent.permissions = [
			{
				action: '*',
				resource: '*',
				effect: 'allow',
			},
		];
	});
}

export function obliqueAgentIdentifier(): string {
	return obliqueAgentId;
}
