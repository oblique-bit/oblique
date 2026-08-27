/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 13 read-only project preparation filesystem checks
 */

export interface ProjectPreparationFileSystem {
	stat: (path: string) => Promise<{isDirectory: () => boolean}>;
	realpath: (path: string) => Promise<string>;
}

export async function getCanonicalDirectory(
	path: string,
	fileSystem: ProjectPreparationFileSystem
): Promise<string | undefined> {
	try {
		return (await fileSystem.stat(path)).isDirectory() ? await fileSystem.realpath(path) : undefined;
	} catch {
		return undefined;
	}
}

export async function pathExists(path: string, fileSystem: ProjectPreparationFileSystem): Promise<boolean> {
	try {
		await fileSystem.stat(path);
		return true;
	} catch {
		return false;
	}
}
