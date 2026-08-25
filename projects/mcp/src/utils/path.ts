/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP cross-platform path-confinement helper
 */

import {isAbsolute, relative, sep} from 'node:path';

export interface PathOperations {
	isAbsolute: (path: string) => boolean;
	relative: (from: string, to: string) => string;
	sep: string;
}

const hostPathOperations: PathOperations = {isAbsolute, relative, sep};

/**
 * Returns whether an already-resolved target is the base path itself or one of its descendants.
 */
export function isPathInside(
	basePath: string,
	targetPath: string,
	pathOperations: PathOperations = hostPathOperations
): boolean {
	const targetRelativePath = pathOperations.relative(basePath, targetPath);
	return (
		!pathOperations.isAbsolute(targetRelativePath) &&
		targetRelativePath !== '..' &&
		!targetRelativePath.startsWith(`..${pathOperations.sep}`)
	);
}
