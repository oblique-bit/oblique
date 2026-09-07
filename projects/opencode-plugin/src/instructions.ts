import type {ObliqueProjectInfo} from './project-detector.js';

const instructionBullets = [
	'prefer existing Oblique components over custom alternatives',
	'query the Oblique MCP before inventing Oblique APIs or selectors',
	'verify component availability for the installed Oblique version',
	'use Oblique examples when available',
	'respect Angular and Oblique compatibility',
	'avoid deprecated Oblique APIs',
	'preserve accessibility requirements',
	'never guess selectors, inputs, outputs, or service APIs when they can be retrieved from the MCP',
] as const;

export function createObliqueAiInstructions(projectInfo: ObliqueProjectInfo): string | undefined {
	if (!projectInfo.isObliqueProject) {
		return undefined;
	}

	const versionDetails: string[] = [];
	if (projectInfo.angularVersion !== undefined) {
		versionDetails.push(`Angular ${projectInfo.angularVersion}`);
	}
	if (projectInfo.obliqueVersion !== undefined) {
		versionDetails.push(`Oblique ${projectInfo.obliqueVersion}`);
	}

	const intro =
		versionDetails.length > 0 ? `This project uses ${versionDetails.join(' and ')}.` : 'This project uses Oblique.';

	return `${intro}\nBefore implementing UI functionality:\n- ${instructionBullets.join('\n- ')}`;
}
