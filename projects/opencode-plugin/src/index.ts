import type {Config, Plugin} from '@opencode-ai/plugin';

import {registerObliqueAgent} from './agent.js';
import {createObliqueAiInstructions} from './instructions.js';
import {applyObliqueMcpConfiguration} from './mcp-config.js';
import {detectObliqueProjectInfo} from './project-detector.js';
import {registerObliqueReviewCommand} from './review.js';
import {registerObliqueStatusCommand} from './status-command.js';

/* eslint-disable @typescript-eslint/require-await */
const obliqueOpenCodePlugin: Plugin = async input => ({
	config: async (config: Config): Promise<void> => {
		try {
			const projectDirectory = input.directory || input.worktree || process.cwd();
			const projectInfo = detectObliqueProjectInfo(projectDirectory);
			if (!projectInfo.isObliqueProject) {
				return;
			}

			applyObliqueMcpConfiguration(config, {env: process.env});
			registerObliqueAgent(config, projectInfo);
			registerObliqueReviewCommand(config, projectInfo);
			registerObliqueStatusCommand(config, projectInfo);
		} catch {
			// OpenCode should keep running even if project or MCP configuration is malformed.
		}
	},
	// eslint-disable-next-line @typescript-eslint/naming-convention
	'experimental.chat.system.transform': async (sessionInput, output): Promise<void> => {
		void sessionInput;
		const projectDirectory = input.directory || input.worktree || process.cwd();
		const projectInfo = detectObliqueProjectInfo(projectDirectory);
		const instruction = createObliqueAiInstructions(projectInfo);
		if (instruction === undefined) {
			return;
		}

		output.system = [...(output.system ?? []), instruction];
	},
});
/* eslint-enable @typescript-eslint/require-await */

export default obliqueOpenCodePlugin;
