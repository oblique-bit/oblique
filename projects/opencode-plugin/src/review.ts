import type {Config} from '@opencode-ai/plugin';

import type {ObliqueProjectInfo} from './project-detector.js';

const reviewCommandName = 'oblique-review';

type CommandConfiguration = NonNullable<Config['command']>[string];

export function createObliqueReviewPrompt(projectInfo: ObliqueProjectInfo): string {
	const versionDetails: string[] = [];
	if (projectInfo.angularVersion !== undefined) {
		versionDetails.push(`Angular ${projectInfo.angularVersion}`);
	}
	if (projectInfo.obliqueVersion !== undefined) {
		versionDetails.push(`Oblique ${projectInfo.obliqueVersion}`);
	}

	const intro =
		versionDetails.length > 0 ? `This project uses ${versionDetails.join(' and ')}.` : 'This project uses Oblique.';

	return `${intro}\nReview the selected files, changed files, or current Angular feature from an Oblique perspective.\n\nRequirements:\n- classify each finding as ERROR, WARNING, or SUGGESTION\n- include for every finding: file, line if available, issue, reason, recommended replacement/fix, and MCP evidence or Oblique API/component used for verification where possible\n- query the Oblique MCP before concluding on Oblique APIs, components, selectors, inputs, outputs, migration guidance or version compatibility\n- prefer existing Oblique components over custom alternatives\n- flag custom implementations when an Oblique equivalent exists\n- flag deprecated Oblique APIs, guessed selectors, invalid inputs/outputs, accessibility issues, obsolete Angular patterns, unnecessary CSS, invalid service usage, and missing Oblique patterns\n- avoid noisy or speculative findings\n- do not change files automatically unless explicitly requested\n- keep the review concise and factual\n\nOutput format:\nERROR\n- file: ...\n- line: ...\n- issue: ...\n- reason: ...\n- recommended fix: ...\n- MCP evidence: ...\n\nWARNING\n- ...\n\nSUGGESTION\n- ...`;
}

export function createObliqueReviewCommandConfiguration(projectInfo: ObliqueProjectInfo): CommandConfiguration {
	return {
		template: '/oblique-review [scope]',
		description: `Review Angular/Oblique code for compatibility, API correctness, and existing Oblique component usage.\n\n${createObliqueReviewPrompt(projectInfo)}`,
		agent: 'oblique',
		subtask: true,
	};
}

export function registerObliqueReviewCommand(config: Config, projectInfo: ObliqueProjectInfo): void {
	if (!projectInfo.isObliqueProject) {
		return;
	}

	const existingCommands = config.command ?? {};
	if (existingCommands[reviewCommandName] !== undefined) {
		return;
	}

	config.command = {...existingCommands, [reviewCommandName]: createObliqueReviewCommandConfiguration(projectInfo)};
}

export function obliqueReviewCommandName(): string {
	return reviewCommandName;
}
