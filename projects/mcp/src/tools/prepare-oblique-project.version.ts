/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 13 project preparation version validation
 */

import type {BlockedProjectPreparation} from './prepare-oblique-project.contracts.js';

const nodeRequirementPrefix = '>=';
const versionPartCount = 3;
const semanticVersionPattern =
	/^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(?:(?:0|[1-9]\d*)|(?:[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*))(?:\.(?:(?:0|[1-9]\d*)|(?:[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*)))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u;

export const unsafeObliqueCliVersions = new Set(['15.4.0', '15.4.1']);

export function getVersionFailure(
	obliqueVersion: string,
	knownObliqueVersion: string
): Pick<BlockedProjectPreparation, 'code' | 'failedCheck' | 'message'> | undefined {
	if (!semanticVersionPattern.test(obliqueVersion)) {
		return {
			code: 'INVALID_OBLIQUE_VERSION',
			failedCheck: 'cli-security',
			message: 'Oblique versions must be explicit semantic versions; latest aliases and ranges are not allowed.',
		};
	}
	if (unsafeObliqueCliVersions.has(obliqueVersion)) {
		return {
			code: 'UNSAFE_CLI_VERSION',
			failedCheck: 'cli-security',
			message: `Oblique CLI version ${obliqueVersion} is not allowed because it is known to be unsafe.`,
		};
	}
	return obliqueVersion === knownObliqueVersion
		? undefined
		: {
				code: 'UNSUPPORTED_OBLIQUE_VERSION',
				failedCheck: 'oblique-version',
				message: `Oblique version ${obliqueVersion} is not supported by this MCP package. Use ${knownObliqueVersion}.`,
			};
}

export function normalizeNodeVersion(nodeVersion: string): string {
	return nodeVersion.replace(/^v/u, '');
}

export function supportsNodeVersion(currentNode: string, nodeRequirement: string): boolean {
	const currentParts = getVersionParts(currentNode);
	const requiredParts = getVersionParts(
		nodeRequirement.startsWith(nodeRequirementPrefix) ? nodeRequirement.slice(nodeRequirementPrefix.length) : ''
	);
	return (
		currentParts !== undefined && requiredParts !== undefined && compareVersionParts(currentParts, requiredParts) >= 0
	);
}

export function getAngularMajor(angularVersion: string): string {
	return /\d+/u.exec(angularVersion)?.[0] ?? 'unknown';
}

function getVersionParts(version: string): [number, number, number] | undefined {
	const parts = version.split('.');
	if (parts.length !== versionPartCount || !parts.every(part => /^\d+$/u.test(part))) {
		return undefined;
	}
	const [major, minor, patch] = parts;
	return [Number(major), Number(minor), Number(patch)];
}

function compareVersionParts(left: [number, number, number], right: [number, number, number]): number {
	const [leftMajor, leftMinor, leftPatch] = left;
	const [rightMajor, rightMinor, rightPatch] = right;
	const majorDifference = leftMajor - rightMajor;
	if (majorDifference !== 0) {
		return majorDifference;
	}
	const minorDifference = leftMinor - rightMinor;
	return minorDifference === 0 ? leftPatch - rightPatch : minorDifference;
}
