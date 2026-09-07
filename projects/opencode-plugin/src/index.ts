import type {Config, Plugin} from '@opencode-ai/plugin';
import {define} from '@opencode-ai/plugin/v2/promise';
import type {ObliquePluginRuntimeState, ObliquePluginStatus, ObliqueProjectContext} from './types.js';

import {registerObliqueAgent} from './agent.js';
import {applyObliqueMcpConfiguration, resolveObliqueMcpConfiguration} from './mcp-config.js';
import {createObliqueAiInstructions} from './instructions.js';
import {detectObliqueProjectInfo} from './project-detector.js';
import {registerObliqueReviewCommand} from './review.js';
import {registerObliqueStatusCommand} from './status.js';

export * from './agent.js';
export * from './instructions.js';
export * from './mcp-config.js';
export * from './project-detector.js';
export * from './review.js';
export * from './status.js';

export const obliqueProjectContext: ObliqueProjectContext = {
	isObliqueProject: false,
	projectName: undefined,
	projectRoot: undefined,
	obliqueVersion: undefined,
	angularVersion: undefined,
};

export const obliquePluginStatus: ObliquePluginStatus = {
	ready: true,
	projectDetected: false,
	message: 'Oblique OpenCode plugin initialized with a thin MCP integration layer.',
};

export const obliquePluginRuntimeState: ObliquePluginRuntimeState = {
	project: obliqueProjectContext,
	status: obliquePluginStatus,
};

/* eslint-disable @typescript-eslint/require-await */
export const obliqueOpenCodePlugin: Plugin = async input => ({
	config: async (config: Config): Promise<void> => {
		try {
			applyObliqueMcpConfiguration(config, {
				env: process.env,
			});
		} catch {
			// OpenCode should keep running even if MCP configuration is malformed.
		}
	},
	// eslint-disable-next-line @typescript-eslint/naming-convention
	'experimental.chat.system.transform': async (sessionInput, output): Promise<void> => {
		void sessionInput;
		const projectDirectory = input.worktree ?? input.directory ?? process.cwd();
		const projectInfo = detectObliqueProjectInfo(projectDirectory);
		const instruction = createObliqueAiInstructions(projectInfo);
		if (instruction === undefined) {
			return;
		}

		output.system = [...(output.system ?? []), instruction];
	},
});
/* eslint-enable @typescript-eslint/require-await */

export const obliqueAgentPlugin = define({
	id: 'oblique-agent',
	async setup(context): Promise<void> {
		await context.agent.transform(draft => {
			const projectDirectory = process.cwd();
			registerObliqueAgent(draft, detectObliqueProjectInfo(projectDirectory));
		});
	},
});

export const obliqueReviewPlugin = define({
	id: 'oblique-review',
	async setup(context): Promise<void> {
		await context.command.transform(draft => {
			const projectDirectory = process.cwd();
			registerObliqueReviewCommand(draft, detectObliqueProjectInfo(projectDirectory));
		});
	},
});

export const obliqueStatusPlugin = define({
	id: 'oblique-status',
	async setup(context): Promise<void> {
		await context.command.transform(draft => {
			const projectDirectory = process.cwd();
			registerObliqueStatusCommand(draft, detectObliqueProjectInfo(projectDirectory));
		});
	},
});

export {applyObliqueMcpConfiguration, resolveObliqueMcpConfiguration};

export default obliqueOpenCodePlugin;
