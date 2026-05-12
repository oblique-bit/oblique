import path from 'path';
import {Files} from './files';
import {fatal} from './utils';

function isRootFileSystem(dir: string): boolean {
	return path.resolve(dir, '..') === dir;
}

/**
 * Find the absolute path of the Oblique's project root. This is done
 * by checking if a `package.json` file exist in the current directory
 * with the `name` entry equals to "oblique". If no `package.json` file is found
 * or if `name` doesn't match the search criteria, then the function is called
 * recursively to the parent directory.
 *
 * @param dirname The current working directory where to search for a `package.json'
 * file. If omitted, then `__dirname` will be used.
 * @returns The absolute path of the Oblique's project root.
 */
export function findObliqueRootPath(dirname?: string): string {
	const workingDir = dirname ?? __dirname;

	// This should never happen...
	if (isRootFileSystem(workingDir)) {
		fatal("Oblique's root cannot be located");
	}

	if (Files.exists(`${workingDir}/package.json`)) {
		const packageJson = Files.readJson(`${workingDir}/package.json`) as Record<'name', string>;
		if (packageJson.name === 'oblique') {
			return workingDir;
		}
		return findObliqueRootPath(path.resolve(workingDir, '..'));
	}

	return findObliqueRootPath(path.resolve(workingDir, '..'));
}

/**
 * Return the absolute path of the resources pointed by `relPath`
 *
 * @param relPath the relative path, it must be relative to the Oblique's
 * project root.
 * @returns the absolute path of the pointed resource.
 */
export function getAbsolutePath(relPath: string): string {
	const rootPath = findObliqueRootPath();
	return path.resolve(rootPath, relPath);
}
