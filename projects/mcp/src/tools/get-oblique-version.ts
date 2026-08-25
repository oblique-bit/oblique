/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 1 initial server
 */

export interface ObliqueVersionInfo {
	obliqueVersion: string;
	angularVersion: string;
	nodeRequirement: string;
	repository: string;
}

export interface PackageMetadata {
	version: string;
	engines: {node: string};
	dependencies: Record<string, string>;
	repository: {url: string};
}

export function getObliqueVersion(metadata: PackageMetadata): ObliqueVersionInfo {
	return {
		obliqueVersion: metadata.version,
		angularVersion: metadata.dependencies['@angular/core'],
		nodeRequirement: metadata.engines.node,
		repository: getRepositoryName(metadata.repository.url),
	};
}

export function getObliqueMajorVersion(metadata: PackageMetadata): number {
	const majorVersion = Number.parseInt(metadata.version.split('.')[0], 10);
	if (!Number.isSafeInteger(majorVersion) || majorVersion < 1) {
		throw new Error(`Unable to determine an Oblique major version from "${metadata.version}".`);
	}
	return majorVersion;
}

function getRepositoryName(repositoryUrl: string): string {
	return repositoryUrl.replace(/^https:\/\/github\.com\//u, '').replace(/\.git$/u, '');
}
